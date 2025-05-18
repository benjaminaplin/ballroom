# Basic TypeScript Ballroom API

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd basic-typescript-server
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure environment (optional)**
   - If you use environment variables, create a `.env` file in the root directory.

4. **Run the development server**
   ```sh
   npm run dev
   ```
   The server will start on [http://localhost:3000](http://localhost:3000).

5. **Build and run with Docker**
   ```sh
   docker build -t ballroom-api .
   docker run -p 3000:3000 ballroom-api
   ```

6. **Run tests**
   ```sh
   npm test
   ```

---

## Design Rationale

- **TypeScript** is used for type safety and maintainability.
- **Express** provides a simple, robust web server for API endpoints.
- **Ramda** is used for functional utilities, especially for set operations like intersection.
- **Modular structure**: API logic is separated into handlers, routers, and models for clarity and testability.
- **Docker** support allows easy containerization and deployment.
- **Testing**: Jest is used for unit testing core logic.

---

## Example API Usage

### 1. Get Hello World
**Endpoint:** `GET /`

**Response:**
```json
Hello, Woroiuboiuld!
```

---

### 2. Ballroom Matching Example
**Endpoint:** `POST /api/ballroom/calculate-partners`

**Request Body:**
```json
{
  "total_leaders": 3,
  "total_followers": 3,
  "dance_styles": ["Waltz", "Tango", "Foxtrot"],
  "leader_knowledge": {
    "1": ["Waltz", "Tango"],
    "2": ["Foxtrot"],
    "3": ["Waltz", "Foxtrot"]
  },
  "follower_knowledge": {
    "A": ["Waltz", "Tango", "Foxtrot"],
    "B": ["Tango"],
    "C": ["Waltz"]
  },
  "dance_duration_minutes": 120
}
```

**Response Example:**
```json
{
  "avgLeaderPartners": 2,
  "avgFollowerPartners": 2,
  "leaderPartners": {
    "1": ["A", "B", "C"],
    "2": ["A"],
    "3": ["A", "C"]
  },
  "followerPartners": {
    "A": ["1", "2", "3"],
    "B": ["1"],
    "C": ["1", "3"]
  }
}
```

---

### 3. Calculate Partners (Logic)
- The API matches leaders and followers who share at least one dance style.
- For each dance session (average 5 minutes per dance), available leaders and followers are randomly matched.
- The API tracks unique partners for each participant and returns the average number of unique partners for leaders and followers.

---

## Notes
- You can modify the input JSON to test different scenarios (e.g., more leaders, followers, or dance styles).
- See the `src/api/ballroom/ballroomHandlers.test.ts` file for more usage and test examples.
