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
        multi labels := .<owner[is Label];
        multi groceryItems := .<owner[is GroceryItem];
        multi stores := .<owner[is Store];
    }

    scalar type Unit extending enum<gram, kilogram, liter, milliliter, piece, bag, box>;

    type Label extending Timestamp{
        required name: str;
        required owner: User;
        constraint exclusive on ((.name, .owner));
    }

    type GroceryItem extending Timestamp {
        required name: str;
        required store: Store;
        required price: float32;
        required amount: float32;
        required unit: Unit;
        optional notes: str;
        optional url: str;
        required owner: User;
        multi labels: Label;
        pricePerUnit := .price / .amount;
        
    }

    type Store extending Timestamp {
        required name: str;
        required owner: User;
        multi groceryItems := .<store[is GroceryItem];
        constraint exclusive on ((.name, .owner));
    }
}
