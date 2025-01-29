# ScrapConnect
## A platform connecting sellers and buyers for efficient scrap pickup services.

User Roles
- Seller – Creates pickup requests.
- Buyer – Accepts requests and picks up scrap.
- Authentication – Secure login via email and password.

Sellers Side:
- Creates a pickup request with:
  - Seller ID
  - Location (latitude & longitude)
  - Scrap details (type, weight, price range)
  - Pickup type (same-day/next-day)
- Saves request to the database.
- Notify nearby buyers (within 5 km) via WebSocket.

Buyer Side:
- Publishes seller requests to a Kafka queue.
- A worker consumes the message and assigns the nearest available buyer using Redis (fast lookups).
- Notifies the assigned buyer in real time via WebSocket.

Request Handling
- Buyers accept/reject pickup requests via an API.
- Updates request status in the database.
- Notifies the seller via WebSocket.

### Tech Stack
Backend: Node.js, Express.js

Database: PostgreSQL

Queue Processing: Apache Kafka

Real-Time Communication: WebSocket

