# TicketHub Design Document

## 1. Requirements

### Functional Requirements
* **User Accounts:** Users must be able to register, log in, and view their profile.
* **Event Browsing:** Users must be able to browse available concerts and events, view event details, and see available seating maps.
* **Seat Holding:** Users must be able to temporarily hold specific seats for a limited time (e.g., 10 minutes) while completing payment.
* **Checkout & Payment:** Users must be able to securely purchase held seats and receive order confirmation.
* **Order History:** Users must be able to view their purchased tickets and active orders.

### Non-Functional Requirements
* **Speed:** Page loads for browsing events must complete under 500ms; seat selection status updates must reflect in near real-time.
* **Correctness:** Zero tolerance for double-booking. Two users must never successfully purchase the exact same seat.
* **Fairness:** A first-come, first-served mechanism during high-demand surges, coupled with a holding queue or rate-limiting to prevent bot domination.

---

## 2. Traffic Estimates

### Normal Traffic
* **Registered Users:** 2,000,000[cite: 2]
* **Daily Visitors:** 50,000 visitors per day[cite: 2]
* **Page Views:** Each visitor views an average of 10 pages $\rightarrow 50,000 \times 10 = 500,000$ page views per day[cite: 2].
* **Daily Sales:** 5,000 tickets sold on a normal day[cite: 2].
* **Average RPS (Requests Per Second):** 
  $$\frac{500,000 \text{ views}}{86,400 \text{ seconds}} \approx 5.8 \text{ requests/sec}$$

### "Big Sale" Peak Traffic (Popular Concert Launch)
* **Burst Load:** 200,000 users try to buy 20,000 seats within the first 10 minutes[cite: 2].
* **Duration:** 10 minutes = 600 seconds.
* **Peak RPS:** 
  $$\frac{200,000 \text{ users}}{600 \text{ seconds}} \approx 333 \text{ requests/sec (concurrent traffic spike)}$$
[cite: 2]
* **Comparison:** Peak burst traffic is roughly **57x** higher in concurrent request intensity compared to normal daily averages, requiring caching layers, asynchronous queuing, and database connection pooling.

---

## 3. API Endpoints (At least 5)

1. **`GET /api/events`**
   * *Description:* Browse or search available concerts and events.
2. **`GET /api/events/{eventId}/seats`**
   * *Description:* View seat layout, pricing, and availability status (available, held, booked) for a specific event.
3. **`POST /api/seats/hold`**
   * *Description:* Temporarily lock selected seats for a user (e.g., 10-minute TTL) before checkout.
4. **`POST /api/orders/checkout`**
   * *Description:* Process payment and finalize the purchase for held seats, converting them to permanently booked tickets.
5. **`GET /api/users/{userId}/tickets`**
   * *Description:* Retrieve all active and past tickets belonging to a specific user.

---

## 4. Data Model (4+ Tables and Relationships)

```text
[USERS] 1 -------- * [ORDERS]
[EVENTS] 1 -------- * [SEATS]
[ORDERS] 1 -------- * [ORDER_ITEMS]
[SEATS] 1 --------- * [ORDER_ITEMS]

1. users Table:

id (PK, UUID/Int)

email (String, Unique)

password_hash (String)

created_at (Timestamp)

2. events Table:

id (PK, UUID/Int)

title (String)

description (Text)

event_date (Timestamp)

3. seats Table:

id (PK, UUID/Int)

event_id (FK to events.id)

seat_number (String, e.g., "A12")

status (Enum: available, held, booked)

held_until (Timestamp, nullable)

4. orders Table:

id (PK, UUID/Int)

user_id (FK to users.id)

total_amount (Decimal)

status (Enum: pending, paid, cancelled)

created_at (Timestamp)

(Note: An order_items mapping table links specific orders and seats to handle multi-seat transactions safely.)

5. Preventing Double-Booking (Concurrency & Transactions)
To ensure two users never buy the same seat, TicketHub uses a combination of Database Transactions, Row-Level Locking, and Status Constraints:

Pessimistic Locking / Atomic Updates: When a user attempts to hold or buy a seat, the database executes a transaction using SELECT ... FOR UPDATE on the specific seat row. This locks the row so concurrent transactions must wait.

Conditional Status Check: The database query explicitly enforces a condition:
UPDATE seats SET status = 'held', held_until = NOW() + INTERVAL 10 MINUTE WHERE id = ? AND status = 'available';

If two users attempt to grab seat A12 simultaneously, the database engine processes one transaction first (changing status from available to held). When the second transaction executes its query, the AND status = 'available' check fails, resulting in 0 affected rows. The application then catches this and informs User 2 that the seat is no longer available.

6. Architecture Diagram & High-Traffic Survival
Plaintext
[Users / Browsers] 
       │
       ▼
[Cloudflare CDN / Load Balancer] (DDoS protection & SSL termination)
       │
       ├─────────────────────────┐
       ▼                         ▼
[API Gateway / Nginx]     [Redis Cache] (Event metadata & session store)
       │
       ▼
[Application Cluster (Node.js/Go)] 
       │
       ├─────────────────────────┐
       ▼                         ▼
[RabbitMQ / Message Queue] [Relational DB (PostgreSQL Primary)] 
 (Handles checkout spikes)       │ (Read Replicas for browsing)
How Architecture Survives the Big Sale:
Load Balancing & Caching: Static assets and event browsing pages are served straight from CDN and Redis cache, shielding the core database from read-heavy traffic.

Message Queuing: During a massive ticket drop, incoming checkout requests are pushed into a message queue (like RabbitMQ or AWS SQS) to process orders sequentially without crashing the database from sudden connection exhaustion.

Read Replicas: Database reads (browsing seats and event lists) are routed to read-only replicas, leaving the primary database dedicated strictly to transactional writes (holding and booking seats).

7. Trade-offs
Strict Consistency vs. Availability (CAP Theorem):

Trade-off: We prioritized Consistency over High Availability for seat booking. It is vital that a seat is never double-booked, even if it means users experience a brief queue or error message during peak flash sales.

Synchronous Payment vs. Asynchronous Processing:

Trade-off: We chose a temporary hold model (10-minute lock). If a user abandons cart, those seats remain locked out of the pool until the TTL expires, temporarily reducing inventory availability for other eager buyers.
