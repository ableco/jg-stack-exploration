# A Stack Story

As a disclaimer, I should say this is my experience and my perception, an experience sometimes _too inside_ into certain teams, and sometimes _too outside_ for others. It's a story about success and failure, about errors and stubbornness, but more importantly, it's a story about projects that were _always_ delivering and learning, which it's an important part of the ethos of Able.

## Choosing Redux

I want to start with Mighty because it was the first project in which I was a TL at Able back in 2016. It was a time where the React Context API was very unstable and not recommended. At that moment the React community (let's call it The Community from now on) was very focused on Flux as an alternative to the MVC pattern of Backbone and Angular. Flux, for reference, was an architecture style that proposed the idea that the data should flow in one direction:

> The state was displayed into the view, which dispatches changes into the state, which was displayed into the view, and so on...

```
State ---> View ---> Dispatcher ---> State ---> View ...
```

Probably the best example of the Flux idea is the [Elm Architecture](https://guide.elm-lang.org/architecture/), but the library that brought Flux to the forefront was [Redux](https://redux.js.org/). At the time, it was magical to see unrelated changes updating information in multiple places inside an app, and use time travel to navigate those changes.

Because of this, we started using Redux at Mighty. We were building stuff while learning how to use it. One of the first questions we had was how to keep state in sync with the API after performing actions. We first tried a pattern similar to this:

```js
// Make a POST request to create something
dispatch(createThing(params)).then(() => {
  // and FETCH stuff to update the store
  dispatch(fetchThings());
});
```

This worked well at the beginning, updating the state from the API always maintains things up to date and this should be fine. Sadly, we soon found some issues with this approach, and that marked the start of a divergence between us and the Community of the future.

## The multiple dispatch problem

At that point, Mighty wanted to show multiple pieces of data in different places at the same time. We had a navbar with many widgets, but let's list a few of them to explain our problem:

- A reminders list, which listed investments that were near to expire. (_some_ investments had an expiration date)
- A chores list, which listed investments that needed some data to be complete. (_some_ investments didn't generate chores)
- A list of the companies that you have invested into.

The code to update the state after an investment creation went like this:

```js
// Let's keep in mind that this was more complex as we had more widgets at some point
dispatch(createInvestment(params)).then(() => {
  dispatch(fetchReminders());
  dispatch(fetchChores());
  dispatch(fetchCompanies());
});
```

The backend code to fetch reminders, chores and companies was _not simple_. For example, a company had a field called `totalValue`, which was the total sum of the latest valuation of every investment of that company for the current user. The graph of how the backend loaded data in every request was the following:

```
- Reminders
	- where Investment.userId = currentUser.id
	- and include investments
- Chores
	- where Investment.userId = currentUser.id
	- and include investments
- Companies
	- where Investment.userId = currentUser.id
	- for each company: totalValue = company.investments.sum { |investment| investment.valuations.last.value }
```

If it's not obvious by the amount of side-loaded data, this _doesn't scale well_. Actually, it scales really bad. In the best case scenario, with only 1 investment, it performs 3 investment queries, 1 reminders query, 1 chores query, 1 companies query and 1 valuation query. With more data, it queries the investments table 3 times plus another for every company the user has invested in, as well as an additional query for each of that investment valuation, and so on.

The first solution to this problem was to do what the text book of Rails performance said: Use [eager-loading](https://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations). This worked fine, but just for a while, because eager-loading is not a silver bullet but a tradeoff. You reduce the amount of queries, but at the price of loading more data than you need. We found that the _whole application was getting slower at seemingly random times_. What happened? After some time, we found that the Ruby Garbage Collector was running [Major GC runs](https://blog.heroku.com/incremental-gc) very often, which basically froze the app to free the memory: we were using more memory than what was normal in Heroku. At that point, we knew something had to be done, and we did 3 things to solve the problem:

1. We increased the size of our Heroku dynos so we had more memory even on review apps.
2. We started de-normalizing the database. For example, instead of loading `investment.valuations.last.value`, we started _saving_ the `lastValuation` value in a column in the investments table that would get updated when a valuation was created, updated or deleted.
3. We started to think of ways to _entirely avoid the backend when it was possible._

## Avoiding the backend

In retrospective, the 3rd bullet point above may seem like an overreaction, but in ~2017 it made a lot of sense. Let's replicate the previous problem but with the mindset of _avoiding the backend_. Let's see the 3 post-creation calls one by one:

1. `fetchReminders` loaded reminders from the database. A reminder is just an object associated with an investment, and so it needs its data to display it. In its more minimalist shape, it has this shape: `{id, investmentId}`. With that in mind, what if the endpoint of reminders only loaded a list of objects with an `investmentId` associated with them?
2. `fetchChores` did the same as `fetchReminders` so it would be the same solution.
3. `fetchCompanies` loaded companies, which _calculated_ their total valuation based on every investment they had. What if instead of asking the backend for the data, it could be calculated in the frontend just adding the valuations of the investments in the store?

If we had all the investments in the store from the start, adding one to the store would cause the 3 widget components to update and re-render. With a normalized store, we could have just this:

```js
// under the hood, createInvestment add the new investment to an investments list
dispatch(createInvestment(params)).then(() => {
  dispatch(fetchReminders());
  dispatch(fetchChores());
});
```

`fetchReminders` and `fetchChores` would _only_ load normalized structures in the following shape: `{ id, investmentId }`. That's only one SQL query per request: A whole complex performance problem was reduced to 2 simple and cacheable queries. The companies list would get the update for free because its `totalValuation` would always be the `sum of the valuations of all the investments of this company`.

So this worked fine in the most important cases but it was difficult to expand into other parts of the application, because, at that time, Mighty needed to build more features as fast as possible, so we were focused more on that than on refactoring all the other parts of the app. At that point, I knew that the approach had some drawbacks, basically 2:

1. Redux action creators were all very similar, and there was duplication when selecting data from the store. A broader set of abstractions would be required at some point.
2. Data was at risk of being out of date if many users updated the same resource at the same time. If 2 users were to create 2 different investments on the same portfolio and the same company, they would get different values. I thought this could be solved just by using websockets to update the state when new data was added, update or removed.

The last problem was the most basic tradeoff of this approach. We gain backend performance at the cost of not having consistency between what was on the store and what was on the backend. I wanted to test this in other projects, and so I moved to Fino and CIP to try it.

## Overpass

In retrospective, creating Overpass was an initiative I wasn't fully invested in but I followed it anyway. There were many factors at that point that I appreciate differently now:

- **I found Websockets aren't that reliable:** The same approach I used at Mighty worked at Fino but revealed that it could not entirely bypass the issue with many users because websockets weren't that reliable. To get a good experience, it needed to reload data from the server anyway.
- **I had the abstractions:** In CIP, I was able to create more terse abstractions instead of action creators and state selectors, which simplified things a lot.
- **Redux was being left behind by the Community:** As Redux relied on global state, the community started pushing more and more the idea of loading data locally. Context, in my experience, was not strong enough to replace Redux, but some other libraries started to come out, but I didn't trust them a lot, mostly because I feared it could end up in the same performance problems we had with Mighty.
- **There wasn't a lot of enthusiasm in other people:** Aside from the CIP team and some other people, the project didn't gain a lot of traction, and that made me doubt about it, but I didn't follow that hunch. We need people to do things, and to enjoy them for these initiatives to be successful.
- **We used JSON:API at it worked fine with it: ** JSON:API worked very well with the approach and it was very nice to work with. I have more ideas about this but I want to explain them later.
- **I felt some pressure to show it to everyone:** It was because I've never showcased these things to a lot of people outside of the team members of Mighty, Fino and CIP, and it seemed like a good idea to work on releasing it.

In the end, I built Overpass because I balanced all the factors and thought there was nothing wrong about it. Right now, I think it wasn't the brightest of the ideas, but still not something I regret doing. It made things extremely easy to work with on CIP: with all the data we needed to load it worked very, very well.

So why I feel it wasn't the brightest of the ideas? Because I've tested the [approach the Community was pushing](https://swr.vercel.app/) and I really like it now (after doing many test applications). I know it may be weird that I don't want to continue pursuing the Overpass approach anymore being the one who built it. Part of it is that after seeing the whole picture, I believe the focus of Overpass on backend performance was a bit misguided.

## The data loading problem again

In `SWR` and `react-query`, there's something global, in the same way in Overpass there's a global database of entities. In those cases, the global is a key-value store of _query results_. The results are not normalized or organized at all. They're basically a blank canvas, and the frontend just loads/reloads data. Sadly, it means that, taking lightly, it replicates the same problem we had at Mighty but with different abstractions (I will use `async`/`await` because we're in 2020 now!):

```js
await createInvestment(params);
mutate("/reminders");
mutate("/chores");
mutate("/companies");
```

So we're at the starting point. What can we do to solve this? The approach of caching queries require the frontend to treat the backend as a black box when loading data. I think we should first stick to that from now on. The problem, from that point of view, is _always_ the backend.

It's a bit of a shame that Rails consumes so much memory, as it is that Heroku provides only 512mb of memory for free review apps, but those are limitations we have to live with. This means we can't just trust simple performance recipes such as using `includes` or `preload`. We need to culturally normalize the denormalization of data: We need to denormalize more, and we need to check the SQL ActiveRecord generates with more care.

Also, I believe part of why this approach can be slow is because our APIs are _too focused_ on resources. In that case, `/reminders` is forced to return something like this:

```json
[
  { id: 1, investment: { id: 1, name: "Investment 1", expiration: ... } },
  { id: 2, investment: { id: 3, name: "Investment 2", expiration: ... } },
]
```

and `/companies` something like this:

```json
[
  { "id": 1, "name": "Coca-Cola", "totalValuation": 1000 },
  { "id": 2, "name": "Pepsi", "totalValuation": 1000 }
]
```

and so on. It's also _just a coincidence_ that every component here is associated with only one resource: `RemindersList` to `/reminders`, `ChoresMenu` to `/chores` and `CompaniesList` to `/chores`, to show some examples. Reality can be, and usually is, more complicated than this. A component may need multiple resources, and the amount of mutations can increase a lot, as we saw happened on Mighty.

So maybe the problem is that we *respect* these resources too much. In this case, these 3 components are actually part of a navigation bar. What if we have one single query for all the navigation bar? For example, let's see this response:

```json
// GET /navbar
{
  "reminders": [
    {
      "id": 1,
      "investmentId": "1",
      "investmentName": "Investment 1",
      "expiration": "..."
    }
  ],
  "chores": [{ "id": 1, "investmentId": "1" }],
  "companies": [{ "id": 1, "name": "Coca-Cola", "totalValuation": 1000 }]
}
```

In this case, the route handler for `/navbar` has all the context it needs to make optimizations. It can minimize the amount of SQL queries it does and use the abstractions required to make this fast. In this sense, there's no real need to load investments or to authenticate the curent user 3 times in order to load a piece of UI. I have used a similar solution to this while keeping the code RESTful in the past by having a resource named like the view (e.g.  `navbar`) but in the end it's the same solution: Having a single request to manage a single view.

Now, playing as the devil's advocate, this approach effectively couples the backend and the frontend, and so it requires more work to support a different type of client (e.g. having N endpoints: `/web/navbar`, `/android/navbar` and `/ios/navbar`). In fact, it would require one extra endpoint for every different type of client our API may have. Fortunately for us, we're not building plattforms that should support a variable amount of unknown and disparate clients that we can't control. We're building applications.

## Looking for of a better API standard

If we start from this premise: **a better approach to building API-backed application UIs is to have a direct correlation between the needs of a single view and a backend response**, we can start evaluating JSON:API in this regard. For example, here are some things it does that don't get along that well with our basic premise:

- JSON:API main building block is the resource, which is often coupled with database records. It's possible to think of a view as a singleton resource, but by doing so we have to *intentionally* ignore all the tools they have around database records.
- JSON:API support for links (which is an implementation of https://en.wikipedia.org/wiki/HATEOAS) follows the assumption that the client should be able to generate whatever data it needs by following links and merging responses.
- JSON:API requires a normalization phase to translate a response into what a view really needs. This is a tiny impedance mismatch, and it can be fixed most of the time by using a library that translates the data into what a view needs. Sadly, sometimes this is not always doable, such as when a view needs to show a UI table that's not directly correlated to a database one.

It also has some PROs that I think we should try to preserve:

- JSON:API response entities tend to have consistent types. Different views can return data of the same type. The `/companies` and `/company/:id` endpoint will in most cases will always return `company` with a  `name`. If taken carelessly, an approach with two endpoints for both views may name both `name` attributes differently.
- JSON:API naming conventions mean that there's no need to translate from underscore case to camel case. This also means that, by knowing about `GET /companies`, we can assume `POST /companies` create a company without having to check somem documentation.

So with these PROs and CONs in mind, I immediately discarded the option to build our own solution because I feel that it could end up in more trouble than anything, and  I started thinking about [JSON-RPC](https://www.jsonrpc.org/specification) and [Graphql](https://graphql.org) as possible alternatives. After some time reading and building small proof of concept projects, I found that JSON-RPC was way too simple, and it lacked many of the good things about JSON:API, mostly discoverability and type consistency.

Graphql, in the other hand, although weird at first, started to make sense the more I looked into it. For those who don't know, the idea of Graphql is to have a query language that asks a server about some specific parts of a a bigger graph that consists on the entire application. For example, `{ companies: { name } }` asks for the `companies` query and for the `name` property inside of it. You can also ask for more parts of the graph and it all would come together in a single request from the server. There's a lot more to say about the Graphql approach (and I heavily suggest anyone to read [this page](https://graphql.org/learn/) about it), but in general I found that it plays well with the basic premise:

- You can build queries and mutations that are **not** database models, just as easy as it is with records. Creating a `navbar` query is not a hackish solution but part of what Graphql says you can do.

- The Graphql ruby gem is built around the concept of types (model types and types that can come from whatever process needs it), and so it's very difficult to break the type consistency we create.
- Graphql *is very discoverable*. In fact, there are many tools that can instrospect your graphql schema even on the text editor. There are many tools to choose from, and it's an entirely different experience compared to the only-discoverable-by-convention approach of JSON:API.

Aside from the points above, the [Graphql gem](https://graphql-ruby.org/) is a very solid library. It has very good documentation, a strong sense of not breaking changes, and in my experience, it just works as it says it does. That's why I wanted to test it further.

After these initial impressions, I noticed I needed to see how it could work against the case I exposed at the start of this post, to see if it could perform well against a similar UI. I built this proof of concept repository: https://github.com/ableco/jg-stack-exploration. The approach I took was the following:

1. First, I built the UI in the most naive and unoptimized way I could while using JSON:API.
2. I refactored the code to use eager loading and denormalizations.
3. Then, I added Graphql, and reimplemented it without further optimizations.
4. I tried consolidating the queries to try to make it as fast as possible. I discovered this really interesting [gem](https://github.com/exAspArk/batch-loader) in the process.
5. I made a measure of the performance of every commit, and posted it in the README.

I strongly suggest you to take a look at the [respository README](https://github.com/ableco/jg-stack-exploration/blob/master/README.md) to see how things went in every case. In general I was pretty much satisfied with the final solution, although it can be improved with some abstractions. Something important to note about it is that, without optimizations, Graphql is not faster than JSON:API. It's still very important to have a performance-oriented mentality when building complex views, as there's no silver bullet.

## Conclusion

The Overpass solution was a solution guided by the current state of Redux and data normalization that we had in 2017, focused on solving backend problems from the client side in a way that avoided calling the API. I believed an approach that called the API a lot could only end in very bad performance issues, but I now think those concerns were not quite correct. After all the story I just told here, I feel It's far more likely that the problems were in our backends all along, and so I think we should change our focus to there, to how to make APIs that are fast, reliable and easy to consume for our current applications.
