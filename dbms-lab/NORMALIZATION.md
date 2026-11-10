# Normalization notes

## 1. Denormalized lot report

A possible denormalized relation is:

LotReport(lot_id, buyer_name, crop_name, farmer_name, listing_id, quantity, unit_price, transport_cost)

### Functional dependencies

- lot_id -> buyer_name, crop_name, transport_cost
- listing_id -> farmer_name, quantity, unit_price
- lot_id, listing_id -> quantity

The candidate key is (lot_id, listing_id).

## 2. 1NF

Remove repeating groups and ensure atomic values. Each row stores one listing contribution only; the lot and listing data are separate.

## 3. 2NF

If there are partial dependencies, move repeated buyer and crop attributes into separate tables. Example: buyer_name is determined by buyer_id, not by lot_id alone.

## 4. 3NF

Remove transitive dependencies. For example, if crop_name depends on crop_id and crop_id depends on the lot, the crop_name should be stored in the crop table instead of the lot table.

### BCNF example

Relation: StudentCourse(student_id, course_id, instructor)
Assumption: instructor determines course_id.
Then (course_id, instructor) is a candidate key and BCNF is violated if the same instructor teaches multiple courses. Decomposition into:

- CourseInstructor(course_id, instructor)
- StudentCourse(student_id, course_id)

This is lossless and dependency-preserving for the stated assumption.

## 5. 4NF

No independent multivalued dependency is present in this small demo, so 4NF is not required.
