# Stack Exploration

## Some Results

### 1. Using JSON:API without N + 1 query management

https://github.com/ableco/jg-stack-exploration/commit/42d7ce7050d4cb092ed7b6562e190430487edd70

| Endpoint       | Time       | Allocations |
| -------------- | ---------- | ----------- |
| `/chores`      | 161ms      | 85,255      |
| `/reminders`   | 207ms      | 109,402     |
| `/companies`   | 289ms      | 139,661     |
| `/investments` | 685ms      | 268,959     |
| Total:         | **1.342s** | **600,277** |

### 2. Using JSON:API with Eager loading

https://github.com/ableco/jg-stack-exploration/commit/48c0df3c697fdd4c7a132604c8787437112c96a4

| Endpoint       | Time      | Allocations |
| -------------- | --------- | ----------- |
| `/chores`      | 114ms     | 63,618      |
| `/reminders`   | 155ms     | 81,788      |
| `/companies`   | 120ms     | 81,278      |
| `/investments` | 283ms     | 167,379     |
| Total:         | **672ms** | **394,063** |

### 3. Using JSON:API with denormalizations

https://github.com/ableco/jg-stack-exploration/commit/416c7a5987fcb454d78d52dfebe3b23ee0139cbf

| Endpoint       | Time      | Allocations |
| -------------- | --------- | ----------- |
| `/chores`      | 72ms      | 47,995      |
| `/reminders`   | 49ms      | 35,108      |
| `/companies`   | 10ms      | 8,055       |
| `/investments` | 47ms      | 34,939      |
| Total:         | **178ms** | **126,097** |

### 4. Using Graphql without N + 1 query management

https://github.com/ableco/jg-stack-exploration/commit/2650fcb27ad2bc6e111d37afc0bc9a274a7f736c

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `chores`      | 339ms     | 195,795     |
| `reminders`   | 223ms     | 125,638     |
| `companies`   | 22ms      | 8,209       |
| `investments` | 300ms     | 186,875     |
| Total:        | **884ms** | **516,517** |

### 5. Using Graphql but with frontend-side consolidation of queries (no N + 1 management yet)

https://github.com/ableco/jg-stack-exploration/commit/ab67804ad90d7be659fd4bbd7a7efee306cdf74e

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `nav bar`     | 537ms     | 302,920     |
| `investments` | 299ms     | 186,001     |
| Total:        | **836ms** | **488,921** |

### 6. Using Graphql but with backend-side consolidation of queries (no N + 1 management yet)

https://github.com/ableco/jg-stack-exploration/commit/7ce79a599b793f1e6c34e71871f016821efdaea3

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `nav bar`     | 510ms     | 328,253     |
| `investments` | 318ms     | 186,000     |
| Total:        | **828ms** | **514,253** |

### 7. Using Graphql with very basic N + 1 query management on the query type level

It's the same link as before: https://github.com/ableco/jg-stack-exploration/commit/7ce79a599b793f1e6c34e71871f016821efdaea3. The difference is the `includes` calls.

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `nav bar`     | 84ms      | 39,961      |
| `investments` | 60ms      | 27,682      |
| Total:        | **144ms** | **67,643**  |

### 8. Using Graphql with Batch Loader gem

https://github.com/ableco/jg-stack-exploration/commit/7e4ab99ff03dc3085d8a5b53dca2b2b918cfd7a2

This is the library used in this commit: https://github.com/exAspArk/batch-loader#graphql-example.

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `nav bar`     | 70ms      | 34,353      |
| `investments` | 77ms      | 28,369      |
| Total:        | **147ms** | **62,722**  |
