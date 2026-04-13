# 🛒 POS Billing System
### Full Stack Web Application — React + Spring Boot + MySQL

---

## 📌 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Design](#4-database-design)
5. [Backend Modules](#5-backend-modules-spring-boot)
6. [REST API Endpoints](#6-rest-api-endpoints)
7. [Frontend Modules](#7-frontend-modules-react)
8. [How Hibernate Creates Tables Automatically](#8-how-hibernate-creates-tables-automatically)
9. [Setup & Run Instructions](#9-setup--run-instructions)
10. [How to Use the Application](#10-how-to-use-the-application)
11. [Features Checklist](#11-features-checklist)
12. [Sample API Requests](#12-sample-api-requests-postman)

---

## 1. Project Overview

**POS (Point of Sale) Billing System** ek full-stack web application hai jo kisi bhi retail shop ya kirana store ke liye banaya gaya hai.

Is system se shopkeeper ye sab kar sakta hai:
- Apne **products** manage karo (naam, price, GST, barcode)
- **Customers** ka record rakho
- **Bills generate** karo with automatic GST calculation
- **Printable 80mm thermal receipt** nikalo
- **Bill history** dekho aur reprint karo

### Architecture
```
[React Frontend]  ←──HTTP/JSON──►  [Spring Boot Backend]  ←──JPA──►  [MySQL Database]
  localhost:3000                       localhost:8080                    pos_db
```

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 18.2 |
| Frontend Language | JavaScript (ES6+) | — |
| Backend | Spring Boot | 3.2.0 |
| Backend Language | Java | 17 |
| ORM | Hibernate (JPA) | 6.3 |
| Database | MySQL | 8.0 |
| Build (Backend) | Apache Maven | 3.8+ |
| Build (Frontend) | npm | 9+ |
| API Style | REST + JSON | — |

---

## 3. Project Structure

```
pos-billing-system/
│
├── backend/                                ← Spring Boot Project
│   ├── pom.xml                             ← Maven dependencies
│   └── src/main/
│       ├── java/com/pos/
│       │   │
│       │   ├── BillingSystemApplication.java   ← Main entry point
│       │   │
│       │   ├── config/
│       │   │   ├── CorsConfig.java             ← Allow React to call APIs
│       │   │   └── GlobalExceptionHandler.java ← Handle errors globally
│       │   │
│       │   ├── entity/                         ← Database Tables (JPA)
│       │   │   ├── Product.java                → products table
│       │   │   ├── Customer.java               → customers table
│       │   │   ├── Bill.java                   → bills table
│       │   │   └── BillItem.java               → bill_items table
│       │   │
│       │   ├── dto/
│       │   │   ├── BillRequest.java            ← Request body for billing
│       │   │   └── ApiResponse.java            ← Standard JSON response
│       │   │
│       │   ├── repository/                     ← Database operations (JPA)
│       │   │   ├── ProductRepository.java
│       │   │   ├── CustomerRepository.java
│       │   │   └── BillRepository.java
│       │   │
│       │   ├── service/                        ← Business Logic
│       │   │   ├── ProductService.java
│       │   │   ├── CustomerService.java
│       │   │   └── BillService.java
│       │   │
│       │   └── controller/                     ← REST API Endpoints
│       │       ├── ProductController.java
│       │       ├── CustomerController.java
│       │       └── BillController.java
│       │
│       └── resources/
│           └── application.properties          ← MySQL DB configuration
│
└── frontend/                               ← React Project
    ├── package.json                        ← npm dependencies
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js                        ← React entry point
        ├── App.js                          ← Main app + navigation tabs
        ├── api.js                          ← All backend API calls
        ├── components.js                   ← Reusable UI components
        ├── printReceipt.js                 ← 80mm receipt HTML generator
        ├── ProductModule.js                ← Product CRUD screen
        ├── CustomerModule.js               ← Customer CRUD screen
        ├── POSModule.js                    ← Main billing/POS screen
        └── BillHistory.js                  ← Bill history & reprint
```

---

## 4. Database Design

> ⚡ **Important:** Tumne manually koi table nahi banaya!
> Jab `mvn spring-boot:run` kiya, tab **Hibernate ne automatically** Java Entity classes padh ke MySQL mein tables bana di.
> `application.properties` mein `spring.jpa.hibernate.ddl-auto=update` iska kaam karta hai.

### 4.1 `products` Table

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique product ID |
| name | VARCHAR | NOT NULL | Product ka naam |
| price | DOUBLE | NOT NULL | Base price (GST ke bina) |
| gst | DOUBLE | NOT NULL | GST percentage (0/5/12/18/28) |
| barcode | VARCHAR | NULL | Optional barcode number |

### 4.2 `customers` Table

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique customer ID |
| name | VARCHAR | NOT NULL | Customer ka poora naam |
| mobile | VARCHAR(10) | NOT NULL | 10-digit mobile number |
| address | VARCHAR | NULL | Customer ka address |

### 4.3 `bills` Table

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Bill number (auto-generated) |
| customer_id | BIGINT | FOREIGN KEY (customers.id), NULL | Customer reference (walk-in ke liye null) |
| total_amount | DOUBLE | NOT NULL | Grand total including GST |
| date | DATETIME | NOT NULL | Bill create hone ka date-time |

### 4.4 `bill_items` Table

| Column | Type | Constraint | Description |
|--------|------|-----------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Item ID |
| bill_id | BIGINT | FOREIGN KEY (bills.id) | Kis bill ka item hai |
| product_id | BIGINT | FOREIGN KEY (products.id) | Konsa product |
| qty | INTEGER | NOT NULL | Kitni quantity |
| price | DOUBLE | NOT NULL | Price at time of billing (snapshot) |
| gst | DOUBLE | NOT NULL | GST % at time of billing (snapshot) |
| total | DOUBLE | NOT NULL | price × qty + GST amount |

### Table Relationships (ER Diagram)

```
customers (1) ──────────── (0..N) bills
                                    │
                                    │ (1)
                                    │
                               (N) bill_items (N) ──── (1) products
```

---

## 5. Backend Modules (Spring Boot)

### Spring Boot Layered Architecture

```
HTTP Request
     │
     ▼
┌─────────────┐
│  Controller │  ← URL mapping, request receive karta hai
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │  ← Business logic (calculations, validations)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Repository  │  ← Database se data fetch/save karta hai
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    MySQL    │  ← Actual data storage
└─────────────┘
```

### 5.1 Entity Classes (`entity/` folder)

Entity classes Java ka representation hain database tables ka.
`@Entity` annotation se Hibernate samajhta hai ki ye ek DB table hai.

**Product.java**
```java
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double price;
    private Double gst;
    private String barcode;
    // getters & setters...
}
```

- `Bill.java` → `bills` table — customer reference + totalAmount + date
- `BillItem.java` → `bill_items` table — product, qty, price, gst, total
- Customer.java → `customers` table — naam, mobile, address

**Bill aur BillItem ka relationship:**
```java
// Bill.java mein:
@OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
private List<BillItem> items;   // Ek bill mein many items

// BillItem.java mein:
@ManyToOne
@JoinColumn(name = "bill_id")
private Bill bill;              // Many items belong to one bill
```

### 5.2 Repository Layer (`repository/` folder)

`JpaRepository` extend karne se CRUD methods automatically mil jaate hain.
Koi extra code likhne ki zaroorat nahi.

```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Auto methods: findAll(), findById(), save(), deleteById()

    // Custom queries:
    List<Product> findByNameContainingIgnoreCase(String name);  // search
    Optional<Product> findByBarcode(String barcode);            // barcode scan
}
```

### 5.3 Service Layer (`service/` folder)

Business logic yahan likhi jati hai. Controller directly repository se baat nahi karta.

**ProductService.java** ke main methods:
| Method | Kaam |
|--------|------|
| `getAllProducts()` | Saare products return karo |
| `getById(id)` | ID se product dhundho, nahi mila to exception |
| `search(query)` | Naam se search karo |
| `create(product)` | Naya product save karo |
| `update(id, product)` | Existing product update karo |
| `delete(id)` | Product delete karo |

**BillService.java** — `@Transactional` important hai:
```java
@Transactional
public Bill createBill(BillRequest request) {
    // 1. Customer dhundho (optional)
    // 2. Bill object banao
    // 3. Har item ke liye BillItem banao
    // 4. Sab ek saath save karo
    // Agar koi error aaye to sab rollback ho jaata hai
}
```

### 5.4 Controller Layer (`controller/` folder)

HTTP requests receive karta hai aur response bhejta hai.

```java
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @GetMapping          // GET /products
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() { ... }

    @PostMapping         // POST /products
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product p) { ... }

    @PutMapping("/{id}") // PUT /products/1
    public ResponseEntity<ApiResponse<Product>> updateProduct(...) { ... }

    @DeleteMapping("/{id}") // DELETE /products/1
    public ResponseEntity<ApiResponse<Void>> deleteProduct(...) { ... }
}
```

### 5.5 DTO Classes (`dto/` folder)

**ApiResponse.java** — Har API ek consistent format mein response deta hai:
```json
{
  "success": true,
  "message": "Product created",
  "data": { "id": 1, "name": "Rice", "price": 50.0, "gst": 5.0 }
}
```

**BillRequest.java** — Bill save karne ka request format:
```json
{
  "customerId": 1,
  "totalAmount": 391.20,
  "items": [
    { "productId": 1, "qty": 2, "price": 150.0, "gst": 5.0, "total": 315.0 }
  ]
}
```

### 5.6 Config Classes (`config/` folder)

**CorsConfig.java** — React (port 3000) ko Spring Boot (port 8080) se baat karne deta hai:
```java
registry.addMapping("/**")
        .allowedOrigins("http://localhost:3000")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
```

**GlobalExceptionHandler.java** — Koi bhi error aaye, clean JSON response milta hai:
```json
{ "success": false, "message": "Product not found: 99", "data": null }
```

---

## 6. REST API Endpoints

### Product APIs

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/products` | Saare products ki list |
| GET | `/products/{id}` | ID se product fetch |
| GET | `/products/search?q=rice` | Naam se search |
| GET | `/products/barcode/{barcode}` | Barcode se product |
| POST | `/products` | Naya product create |
| PUT | `/products/{id}` | Product update |
| DELETE | `/products/{id}` | Product delete |

### Customer APIs

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/customers` | Saare customers |
| GET | `/customers/{id}` | ID se customer |
| GET | `/customers/search?q=rahul` | Naam se search |
| GET | `/customers/mobile/{mobile}` | Mobile se customer |
| POST | `/customers` | Naya customer add |
| PUT | `/customers/{id}` | Customer update |
| DELETE | `/customers/{id}` | Customer delete |

### Bill APIs

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/bills` | Naya bill create karo |
| GET | `/bills` | Saare bills (newest first) |
| GET | `/bills/{id}` | Bill by ID |
| GET | `/bills/customer/{id}` | Customer ke saare bills |

---

## 7. Frontend Modules (React)

### React Concepts Used

| Concept | Usage |
|---------|-------|
| `useState` | Form data, cart items, modal open/close |
| `useEffect` | Page load pe API se data fetch |
| `useCallback` | Load functions memoize karna |
| Functional Components | Har module ek function component hai |
| Props | Data parent se child component ko pass |

### 7.1 `api.js` — Centralized API Layer

Saari backend calls yahan se hoti hain. Kisi bhi module ko directly fetch nahi likhna padta.

```javascript
export const productApi = {
  getAll:   ()         => req("GET",    "/products"),
  create:   (data)     => req("POST",   "/products", data),
  update:   (id, data) => req("PUT",    `/products/${id}`, data),
  delete:   (id)       => req("DELETE", `/products/${id}`),
  search:   (q)        => req("GET",    `/products/search?q=${q}`),
};
```

### 7.2 `components.js` — Reusable UI Components

| Component | Description |
|-----------|-------------|
| `Modal` | Popup dialog — Add/Edit forms ke liye |
| `Field` | Input field with label + error message |
| `Btn` | Styled button (purple, green, amber, red) |
| `Table` | Data table with hover effect |
| `SearchBar` | Search input with icon |
| `Toast` | Success/Error notification (2.8 sec) |
| `Spinner` | Loading animation |
| `Badge` | Colored label (count, status) |

### 7.3 `ProductModule.js` — Product Screen

**Flow:**
```
Page Load
    │
    ▼
useEffect → productApi.getAll() → setProducts(data)
    │
    ▼
Table render karo (search filter ke saath)
    │
    ├── Add button → Modal open → form fill → productApi.create() → reload
    ├── Edit button → Modal open (pre-filled) → productApi.update() → reload
    └── Delete button → confirm → productApi.delete() → reload
```

**Special Feature:** GST Rate buttons (0%, 5%, 12%, 18%, 28%) + Price Preview box jo automatically calculate karta hai:
```
Base Price: ₹500
GST @5%:    ₹25
Customer Pays: ₹525
```

### 7.4 `CustomerModule.js` — Customer Screen

ProductModule jaise hi kaam karta hai with:
- **Avatar** — Customer naam ka pehla letter circle mein dikhata hai
- **Mobile Validation** — `/^[6-9]\d{9}$/` — sirf valid Indian numbers accept
- Search by name ya mobile number

### 7.5 `POSModule.js` — Billing Screen (Main Module)

Ye sabse complex module hai. Billing ka poora flow:

```
1. Customer Select (optional)
        │
        ▼
2. Product Search → Add to Cart
        │
        ▼
3. Cart Management
   ├── Qty + / -
   ├── Direct qty input
   └── Remove item
        │
        ▼
4. Auto Calculations
   ├── Subtotal = Σ(price × qty)
   ├── GST     = Σ(price × qty × gst%)
   ├── Discount (manual, optional)
   └── Grand Total = Subtotal + GST - Discount
        │
        ▼
5. Save Bill → billApi.create() → Bill ID milta hai
        │
        ▼
6. Print Receipt → printReceipt.js → window.print()
```

**GST Slab Breakdown:** Agar multiple GST rates hain:
```
GST @5%  on ₹320 = ₹16.00
GST @18% on ₹100 = ₹18.00
Total GST         = ₹34.00
```

### 7.6 `BillHistory.js` — Bill History Screen

- Newest bills sabse upar (sorted by date desc)
- Search by bill number ya customer naam
- Click karo → detail panel mein items dikhe
- Reprint button → purani bill ki receipt dobara print

### 7.7 `printReceipt.js` — 80mm Thermal Receipt

Ek new browser window mein HTML generate karta hai:

```
================================
       🛒 KRISHNA STORES
    Main Bazaar, Nashik - 422001
     📞 98765-43210
================================
Bill #: 1001        Date: 11/04/2026
Time: 02:45 PM
Customer: Rahul Sharma
Mobile: 9876543210
--------------------------------
Item          Qty  Rate    Amt
--------------------------------
Basmati Rice   1  ₹320  ₹336.00
  (GST 5% = ₹16.00)
Surf Excel     2  ₹185  ₹436.60
  (GST 18% = ₹33.30)
--------------------------------
Subtotal              ₹690.00
Total GST              ₹49.30
================================
GRAND TOTAL           ₹739.30
================================
Payment: Cash
================================
  ★ धन्यवाद! पुनः पधारें ★
================================
```

---

## 8. How Hibernate Creates Tables Automatically

**Ye ek bahut important concept hai!**

Tumne manually koi SQL `CREATE TABLE` nahi likha. Phir bhi MySQL mein tables ban gayi — kyunki:

### `application.properties` mein ye setting hai:
```properties
spring.jpa.hibernate.ddl-auto=update
```

### Jab `mvn spring-boot:run` kiya, Console mein ye aaya:
```sql
Hibernate: create table bill_items (id bigint not null auto_increment, ...)
Hibernate: create table bills (id bigint not null auto_increment, ...)
Hibernate: alter table bill_items add constraint foreign key (bill_id) references bills(id)
```

### Mapping:
```
Java Class          →    MySQL Table
──────────────────────────────────────
Product.java        →    products
Customer.java       →    customers
Bill.java           →    bills
BillItem.java       →    bill_items
```

### Verify karo MySQL Workbench mein:
```sql
USE pos_db;
SHOW TABLES;

-- Result:
-- bill_items
-- bills
-- customers
-- products
```

### `ddl-auto` Options:
| Value | Kaam |
|-------|------|
| `update` | Tables nahi hain to banata hai ✅ (Hamara use) |
| `create` | Har restart pe tables drop karke dobara banata hai |
| `create-drop` | App band hone pe tables delete |
| `none` | Kuch nahi karta — manually banana padta hai |

---

## 9. Setup & Run Instructions

### Prerequisites

| Software | Version | Download |
|----------|---------|----------|
| Java JDK | 17+ | adoptium.net |
| Apache Maven | 3.8+ | maven.apache.org |
| Node.js | 18+ | nodejs.org |
| MySQL | 8.0 | dev.mysql.com |

### Step 1 — MySQL Database Setup

MySQL Workbench mein run karo:
```sql
CREATE DATABASE pos_db;
```

### Step 2 — Backend Configure Karo

`backend/src/main/resources/application.properties` mein apna password daalo:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pos_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD   ← YAHAN APNA PASSWORD DAALO

spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false

server.port=8080
```

### Step 3 — Backend Run Karo

```bash
cd backend
mvn spring-boot:run
```

✅ Success message:
```
Started BillingSystemApplication in 4.455 seconds
API: http://localhost:8080
```

### Step 4 — Sample Data Insert Karo

Backend start hone ke baad MySQL Workbench mein:
```sql
USE pos_db;

INSERT INTO products (name, price, gst, barcode) VALUES
('Basmati Rice 5kg', 320.00, 5.0,  '8901234567890'),
('Tata Salt 1kg',     22.00, 0.0,  '8902345678901'),
('Amul Butter 500g', 280.00, 12.0, '8903456789012'),
('Parle-G Biscuit',   10.00, 18.0, '8904567890123'),
('Surf Excel 1kg',   185.00, 18.0, '8905678901234'),
('Colgate 200g',      95.00, 18.0, '8906789012345'),
('Sunflower Oil 1L', 140.00, 5.0,  '8907890123456'),
('Maggi 70g',         14.00, 18.0, '8908901234567');

INSERT INTO customers (name, mobile, address) VALUES
('Rahul Sharma', '9876543210', '123 MG Road Mumbai'),
('Priya Patel',  '9765432109', '456 Lal Bagh Pune'),
('Amit Kumar',   '9654321098', '789 Civil Lines Delhi');
```

### Step 5 — Frontend Run Karo

**Naya terminal kholo** (backend wala band mat karo):
```bash
cd frontend
npm install     ← Pehli baar sirf
npm start
```

✅ Browser automatically open hoga: **http://localhost:3000**

---

## 10. How to Use the Application

### Bill Banana — Step by Step

1. **POS / Billing** tab pe jao
2. Customer search karke select karo (ya skip karo — walk-in allowed)
3. Product search karo → cart mein add ho jaayega
4. Quantities adjust karo `+` / `-` buttons se
5. Discount daalo (optional)
6. **Save Bill** click karo
7. **Print Receipt** se 80mm thermal receipt print karo

### Product Add Karna

1. **Products** tab → **Add Product** button
2. Naam, Price, GST rate (button click), Barcode (optional) fill karo
3. Price Preview check karo (auto calculate)
4. **Save Product** → list mein aa jaayega

### Customer Add Karna

1. **Customers** tab → **Add Customer** button
2. Naam, Mobile (10 digit), Address fill karo
3. **Save Customer**

---

## 11. Features Checklist

| Feature | Status |
|---------|--------|
| Product Add / Edit / Delete / View | ✅ |
| Customer Add / Edit / Delete / View | ✅ |
| POS Billing Screen | ✅ |
| Product Search (name + barcode) | ✅ |
| Auto GST Calculation per item | ✅ |
| GST Slab Breakdown panel | ✅ |
| Discount field | ✅ |
| Cart — Add, Remove, Qty update | ✅ |
| Walk-in Customer support | ✅ |
| Save Bill to MySQL | ✅ |
| Auto Bill Number generation | ✅ |
| 80mm Thermal Receipt Print | ✅ |
| Bill History — view all bills | ✅ |
| Reprint from History | ✅ |
| Toast notifications | ✅ |
| Form Validation | ✅ |
| Global Error Handling (Backend) | ✅ |
| CORS Configuration | ✅ |
| Standard API Response format | ✅ |
| Hibernate Auto Table Creation | ✅ |

---

## 12. Sample API Requests (Postman)

### Create Product
```
POST http://localhost:8080/products
Content-Type: application/json

{
  "name": "Basmati Rice 5kg",
  "price": 320.00,
  "gst": 5.0,
  "barcode": "8901234567890"
}
```

### Create Customer
```
POST http://localhost:8080/customers
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "mobile": "9876543210",
  "address": "123 MG Road Mumbai"
}
```

### Create Bill
```
POST http://localhost:8080/bills
Content-Type: application/json

{
  "customerId": 1,
  "totalAmount": 391.20,
  "items": [
    {
      "productId": 1,
      "qty": 1,
      "price": 320.00,
      "gst": 5.0,
      "total": 336.00
    },
    {
      "productId": 2,
      "qty": 2,
      "price": 22.00,
      "gst": 0.0,
      "total": 44.00
    }
  ]
}
```

### API Response Format
```json
{
  "success": true,
  "message": "Bill created",
  "data": {
    "id": 1001,
    "totalAmount": 391.20,
    "date": "2026-04-11T14:42:00",
    "customer": { "id": 1, "name": "Rahul Sharma" },
    "items": [ ... ]
  }
}
```

---

## 📞 Running URLs

| Service | URL |
|---------|-----|
| Frontend (React) | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Products API | http://localhost:8080/products |
| Customers API | http://localhost:8080/customers |
| Bills API | http://localhost:8080/bills |

---

*Made with ❤️ using React + Spring Boot + MySQL*
