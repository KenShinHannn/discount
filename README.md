Discount Calculation Module
โปรเจคนี้คือระบบคำนวณส่วนลดที่รองรับประเภทส่วนลดหลากหลาย เช่น ส่วนลดแบบจำนวนเงินคงที่ (Fixed Amount), ส่วนลดเปอร์เซ็นต์ (Percentage), ส่วนลดตามหมวดหมู่ (Category-based), ส่วนลดจากแต้มสะสม (Points-based), และส่วนลดตามฤดูกาล (Seasonal) ซึ่งสามารถนำไปใช้ในการคำนวณราคาสินค้าในตะกร้าได้

## Project setup

yarn install

## DB Setup
โปรเจคนี้ใช้ฐานข้อมูล MySQL ดังนั้นคุณต้องตั้งค่า MySQL และสร้างฐานข้อมูล discount_db ขึ้นมาก่อน
ผมได้ใส่คำสั่งสร้าง schema กับ table ไว้ที่ /discount/db/db.create.text 
แล้วก็ได้ใส่คำรั่ง insert ข้อมูล ไว้ที่ /discount/db/db.insert.text

## run the project
# watch mode

yarn run start:dev

## Run tests

yarn run test

## Swagger for use api document 
http://localhost:3001/api

ตัวอย่างการใช้งาน API
โปรเจคนี้มีฟีเจอร์หลายประเภทในการคำนวณส่วนลด 

1. ส่วนลดแบบจำนวนเงินคงที่ (Fixed Amount)
คำนวณส่วนลดทั้งหมดจากยอดรวมของตะกร้าสินค้าโดยการหักจำนวนเงินจากราคาทั้งหมด

ตัวอย่าง JSON Request:
## type: Fixed amount 
## Category: Coupon
## Discounts the entire cart by subtracting an amount from the total price
{
  "ruleId": [1],
  "cartItems": [
        {
          "name": "T-Shirt",
          "price": 350,
          "category": "T-Shirt",
          "quantity": 1
        },
        {
          "name": "Hat",
          "price": 250,
          "category": "Hat",
          "quantity": 1
        }
      ],
  "pointsUsed": 0,
  "originalPrice": 0,
  "finalPrice": 0,
  "createdAt": "2025-05-13T00:08:02.974Z",
  "updatedAt": "2025-05-13T00:08:02.974Z"
}

2. ส่วนลดแบบเปอร์เซ็นต์ (Percentage Discount)
คำนวณส่วนลดทั้งหมดจากยอดรวมของตะกร้าสินค้าโดยการหักเปอร์เซ็นต์จากราคาทั้งหมด

ตัวอย่าง JSON Request:
## type: Percentage discount 
## Category: Coupon
## Discounts the entire cart by subtracting a percentage from the total price

{
  "ruleId": [2],
  "cartItems": [
        {
          "name": "T-Shirt",
          "price": 350,
          "category": "T-Shirt",
          "quantity": 1
        },
        {
          "name": "Hat",
          "price": 250,
          "category": "Hat",
          "quantity": 1
        }
      ],
  "pointsUsed": 0,
  "originalPrice": 0,
  "finalPrice": 0,
  "createdAt": "2025-05-13T00:08:02.974Z",
  "updatedAt": "2025-05-13T00:08:02.974Z"
}

3. ส่วนลดตามหมวดหมู่ (Category-based)
คำนวณส่วนลดสำหรับสินค้าที่อยู่ในหมวดหมู่เดียวกันโดยเฉพาะ

ตัวอย่าง JSON Request:
## type: Percentage discount by item category
## Category: On Top
## Discount the entire amount of a specific category of items in cart

{
  "ruleId": [3],
  "cartItems": [
        {
          "name": "T-Shirt",
          "price": 350,
          "category": "Clothing",
          "quantity": 1
        },
        {
          "name": "Hoodie",
          "price": 700,
          "category": "Clothing",
          "quantity": 1
        },
{
          "name": "Watch",
          "price": 850,
          "category": "Accessory",
          "quantity": 1
        },
        {
          "name": "Bag",
          "price": 640,
          "category": "Accessory",
          "quantity": 1
        }
      ],
  "pointsUsed": 0,
  "originalPrice": 0,
  "finalPrice": 0,
  "createdAt": "2025-05-13T00:08:02.974Z",
  "updatedAt": "2025-05-13T00:08:02.974Z"
}

4. ส่วนลดจากแต้มสะสม (Points-based Discount)
ใช้แต้มสะสมของผู้ใช้ในการลดราคาสินค้า โดยมีข้อจำกัดที่ 20% ของราคาทั้งหมด

ตัวอย่าง JSON Request:
## type: Discount by points
## Category: On Top
## Users spent points for a fixed amount of discount (1 point = 1 THB). The amount will be capped at 20% of total price

{
  "ruleId": [4],
  "cartItems": [
        {
          "name": "T-Shirt",
          "price": 350,
          "category": "Clothing",
          "quantity": 1
        },
        {
          "name": "Hat",
          "price": 250,
          "category": "Accessory",
          "quantity": 1
        },
{
          "name": "Belt",
          "price": 230,
          "category": "Accessory",
          "quantity": 1
        }
      ],
  "pointsUsed": 68,
  "originalPrice": 0,
  "finalPrice": 0,
  "createdAt": "2025-05-13T00:08:02.974Z",
  "updatedAt": "2025-05-13T00:08:02.974Z"
}

5. ส่วนลดตามฤดูกาล (Seasonal Discount)
ใช้กฎที่กำหนดว่า เมื่อยอดรวมถึงจำนวนที่กำหนด ให้หักยอดตามจำนวนที่กำหนด
ตัวอย่าง JSON Request:
## type: Special campaigns 
## Category: Seasonal
## From the total price, at every X THB, subtracting a fixed amount Y THB
{
  "ruleId": [5],
  "cartItems": [
    {
      "name": "T-Shirt",
      "quantity": 1,
      "price": 350,
      "category": "Clothing"
    },
{
      "name": "Hat",
      "quantity": 1,
      "price": 250,
      "category": "Clothing"
    },
{
      "name": "Belt",
      "quantity": 1,
      "price": 230,
      "category": "Accessory"
    }

  ],
  "pointsUsed": 0,
  "originalPrice": 0,
  "finalPrice": 0,
  "createdAt": "2025-05-13T00:08:02.974Z",
  "updatedAt": "2025-05-13T00:08:02.974Z"
}