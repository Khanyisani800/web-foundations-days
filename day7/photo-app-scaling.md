# SnapShare Scaling Plan

## 1. Assumptions and Daily Active Users (DAU)
* **Registered Users:** 10,000,000[cite: 5]
* **Activity Rate:** 10% of registered users are active daily[cite: 5]
* **Daily Active Users (DAU):** $10,000,000 \times 0.10 = 1,000,000$ active users
* **Content Creation:** Each active user uploads 1 photo per day[cite: 5]
* **Content Consumption:** Each active user views 50 feed pages per day[cite: 5]
* **File Sizes:** Average photo size is 2 MB; thumbnail size is 50 KB[cite: 5]
* **Time Conversion:** 1 day is estimated as 100,000 seconds for calculations[cite: 2, 5]

---

## 2. Capacity Calculations
* **Uploads Per Second (Average):** 
  $$\frac{1,000,000 \text{ uploads/day}}{100,000 \text{ seconds/day}} = 10 \text{ writes/sec}$$
* **Uploads Per Second (Peak at $5\times$):** 
  $$10 \times 5 = 50 \text{ writes/sec}$$
* **Feed Views Per Second (Average):** 
  $$\frac{1,000,000 \text{ users} \times 50 \text{ views/day}}{100,000 \text{ seconds}} = \frac{50,000,000}{100,000} = 500 \text{ reads/sec}$$
* **Feed Views Per Second (Peak at $5\times$):** 
  $$500 \times 5 = 2,500 \text{ reads/sec}$$
* **Photo Storage Per Year:**
  * Original photo daily storage: $1,000,000 \times 2 \text{ MB} = 2,000,000 \text{ MB} = 2 \text{ TB/day}$
  * Thumbnail daily storage: $1,000,000 \times 50 \text{ KB} = 50,000,000 \text{ KB} = 50 \text{ GB/day}$
  * Total daily storage: $2.05 \text{ TB/day}$
  * Yearly storage: $2.05 \text{ TB} \times 365 \text{ days} = 748.25 \text{ TB/year}$

---

## 3. System Workload Characterization
* **Design Classification:** The system is **read-heavy** (500 to 2,500 reads/sec versus 10 to 50 writes/sec).
* **Design Implication:** Because feed views heavily outnumber photo uploads, the architecture must prioritize fast read operations by leveraging caching layers, a Content Delivery Network (CDN) for static assets, and database read replicas to scale read traffic efficiently.

---

## 4. Photo Storage Strategy
* **Why not in the database?** Storing large binary files (BLOBs) directly inside relational databases degrades query performance, inflates backup sizes, increases memory pressure, and drastically drives up expensive transactional database storage costs.
* **Where they go instead:** Photos and thumbnails should be stored in **Object Storage** (such as AWS S3 or Google Cloud Storage), which is specifically optimized for cost-effective, durable storage and direct retrieval of unstructured binary data.

---

## 5. Architecture Text Diagram

```text
[ User / Client ]
       │
       ▼
    [ CDN ] ──(Cached Images/Thumbnails)
       │
       ▼
 [ Load Balancer ]
       │
       ├─────────────────────────┐
       ▼                         ▼
[ App Server 1 ]          [ App Server 2 ]
       │                         │
       ├──────────────┬──────────┴──────────┐
       ▼              ▼                     ▼
[ Redis Cache ]  [ Object Storage ]   [ Primary DB (Writes) ]
                      (S3 / GCS)            │
                                            ▼
                                     [ Read Replica (Reads) ]
                                            │
                                            ▼
                                     [ Message Queue ] ──> [ Thumbnail Worker ]



## 6. Component Descriptions
* **CDN:** Caches and serves static media (photos and thumbnails) from edge locations geographically closer to the user to minimize latency.
* **Load Balancer:** Distributes incoming user traffic evenly across multiple stateless application servers to ensure high availability.
* **App Servers:** Handle incoming API requests, authenticate users, coordinate uploads, and assemble user feeds.
* **Cache (Redis):** Stores frequently accessed metadata and user feeds in-memory to reduce database query load and speed up response times.
* **Database (Primary & Read Replica):** The primary database handles user accounts and relationship writes, while read replicas scale out read-heavy feed queries.
* **Object Storage:** Provides scalable, durable, and cost-effective cloud storage for raw image files and generated thumbnails.
* **Queue & Worker:** Asynchronously processes uploaded images in the background to generate compressed thumbnail versions without blocking the user request.

---

## 7. Step-by-Step Upload Flow
1. **Initiate Upload:** The client app sends an image upload request to the Load Balancer, which routes it to an Application Server.
2. **Store Binary File:** The App Server uploads the raw image file directly to Object Storage and receives back a file URL/key.
3. **Save Metadata:** The App Server writes the post metadata (caption, user ID, image URL, timestamp) to the Primary Database.
4. **Queue Thumbnail Job:** The App Server pushes a background job message containing the image reference to the Message Queue.
5. **Acknowledge User:** The server returns an immediate success response to the client so the user doesn't experience hanging latency.
6. **Background Processing:** A Worker picks up the job from the queue, fetches the original image from Object Storage, generates a 50 KB thumbnail, and saves the thumbnail back to Object Storage.

---

## 8. Trade-Offs
* **Strong Consistency vs. Eventual Consistency for Feeds:** Opting for eventual consistency allows us to cache user feeds for fast loading, meaning followers might notice a slight delay before a newly uploaded photo appears in their feed.
* **Storage Cost vs. Quality:** Storing raw high-resolution 2 MB photos guarantees pristine visual fidelity, but incurs significant long-term cloud object storage costs compared to aggressive client-side compression.
