# ScrapConnect
## Reflects the connection between sellers and buyers for scrap pickup services.

A microservice for managing pickup requests between sellers and buyers.

Features:

Request Creation API:

- Sellers create a pickup request, including:
  - Seller ID
  - Location (latitude & longitude)
  - Scrap details (type, weight, price range)
  - Pickup type (same-day/next-day)
- Save this to the database.
- Notify nearby buyers (within 5 km) via WebSocket.

Buyer :

- Publish seller requests to a Kafka queue.
- A worker consumes the message and assigns the nearest available buyer using Redis (cache for fast lookups).
- Notify the assigned buyer in real time using WebSocket.

Request Acceptance API:

- Buyers accept/reject the seller's request.
- Update the request status in the database.
- Notify the seller via WebSocket.
