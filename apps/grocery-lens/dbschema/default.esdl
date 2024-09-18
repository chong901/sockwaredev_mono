module default {
    abstract type Timestamp {
        required created_at: datetime {
            default := datetime_current();
        };
        updated_at: datetime {
            rewrite update using (std::datetime_of_statement());
        };
    }

    type User extending Timestamp {
        required email: str {
            constraint exclusive;
        }
        name: str;
        image: str;
    }
}
