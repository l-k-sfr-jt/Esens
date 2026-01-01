import {clsx} from 'clsx';
import {ApartmentType} from "@/app/domain/ApartmentType";
import {FocusEvent} from "react";

interface CheckboxOption<T extends string = string> {
    value: T;
    label: string;
}

interface ApartmentTypeSelectorProps {
    label: string;
    options: CheckboxOption<ApartmentType>[];
    value?: ApartmentType[];
    onChange?: (values: ApartmentType[]) => void;
    onBlur?: (e: FocusEvent) => void;
    className?: string;
}

export function ApartmentTypeSelector({className, label, options, value = [], onChange, onBlur}: ApartmentTypeSelectorProps) {
    const handleToggle = (val: ApartmentType) => {
        if (!onChange) return;
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    return (
        <fieldset className={clsx(className, 'text-white')}>
            <legend className="pb-2.5">{label}</legend>
            <div className="max-w-max flex border border-white rounded-sm p-1 gap-[0.1rem]" role="group">
                {options.map(({label, value: optionValue}, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            name={`apartmentType.${index}`}
                            value={optionValue}
                            id={optionValue}
                            checked={value.includes(optionValue)}
                            onChange={() => handleToggle(optionValue)}
                            onBlur={onBlur}
                            className="peer sr-only"
                        />
                        <label
                            className="block px-6 py-2 peer-checked:bg-white rounded-sm peer-checked:text-primary text-xs cursor-pointer  peer-focus-visible:outline peer-focus-visible:outline-white peer-focus-visible:outline-offset-2 transition-colors"
                            htmlFor={optionValue}
                        >
                            {label}
                        </label>
                    </div>
                ))}
            </div>
        </fieldset>
    );
}
