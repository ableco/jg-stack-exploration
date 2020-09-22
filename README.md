# Stack Exploration

1. Using JSON:API without N + 1 query management

| Endpoint       | Time       | Allocations |
| -------------- | ---------- | ----------- |
| `/chores`      | 161ms      | 85,255      |
| `/reminders`   | 207ms      | 109,402     |
| `/companies`   | 289ms      | 139,661     |
| `/investments` | 685ms      | 268,959     |
| Total:         | **1.342s** | **600,277** |

2. Using JSON:API with Eager loading

| Endpoint       | Time      | Allocations |
| -------------- | --------- | ----------- |
| `/chores`      | 114ms     | 63,618      |
| `/reminders`   | 155ms     | 81,788      |
| `/companies`   | 120ms     | 81,278      |
| `/investments` | 283ms     | 167,379     |
| Total:         | **672ms** | **394,063** |

3. Using JSON:API with denormalizations

| Endpoint       | Time      | Allocations |
| -------------- | --------- | ----------- |
| `/chores`      | 72ms      | 47,995      |
| `/reminders`   | 49ms      | 35,108      |
| `/companies`   | 10ms      | 8,055       |
| `/investments` | 47ms      | 34,939      |
| Total:         | **178ms** | **126,097** |

4. Using Graphql without N + 1 query management

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `chores`      | 339ms     | 195,795     |
| `reminders`   | 223ms     | 125,638     |
| `companies`   | 22ms      | 8,209       |
| `investments` | 300ms     | 186,875     |
| Total:        | **884ms** | **516,517** |

5. Using Graphql but with frontend-side consolidation of queries (no N + 1 management yet)

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `nav bar`     | 537ms     | 302,920     |
| `investments` | 299ms     | 186,001     |
| Total:        | **836ms** | **488,921** |

6. Using Graphql but with backend-side consolidation of queries (no N + 1 management yet)

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `nav bar`     | 510ms     | 328,253     |
| `investments` | 318ms     | 186,000     |
| Total:        | **828ms** | **514,253** |

6. Using Graphql with very basic N + 1 query management on the query type level

| Query         | Time      | Allocations |
| ------------- | --------- | ----------- |
| `nav bar`     | 84ms      | 39961       |
| `investments` | 60ms      | 27682       |
| Total:        | **144ms** | **67,643**  |
