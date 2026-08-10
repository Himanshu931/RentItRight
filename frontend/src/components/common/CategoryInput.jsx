import { ITEM_CATEGORIES } from "../../constants/itemCategories";

export default function CategoryInput({
    id = "category",
    name = "category",
    value,
    onChange,
    required = false,
    className = "",
    placeholder = "Type or select a category"
}) {
    const listId = `${id}-options`;

    return (
        <>
            <input
                id={id}
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                list={listId}
                placeholder={placeholder}
                className={className}
                required={required}
                autoComplete="off"
            />
            <datalist id={listId}>
                {ITEM_CATEGORIES.map((category) => (
                    <option key={category} value={category} />
                ))}
            </datalist>
        </>
    );
}
