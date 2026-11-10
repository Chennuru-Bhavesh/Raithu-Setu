# ER Diagram

```mermaid
erDiagram
    USERS ||--o{ FARMERS : owns
    USERS ||--o{ BUYERS : owns
    CROPS ||--o{ CROP_ALIASES : has
    FARMERS ||--o{ LISTINGS : sells
    BUYERS ||--o{ REQUIREMENTS : posts
    BUYERS ||--o{ LOTS : purchases
    LOTS ||--o{ LOT_CONTRIBUTIONS : includes
    LISTINGS ||--o{ LOT_CONTRIBUTIONS : contributes
    LOTS ||--o{ LOT_STATUS_HISTORY : updates
    LOTS ||--o{ TRANSPORT_QUOTES : receives
```
