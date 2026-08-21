import React from "react";

// Деструктуризируем пропсы: выделяем className и children, 
// а все остальные пропсы (onClick, disabled, type и т.д.) собираем в restProps
const Button = ({ className, children, ...restProps }) => {
  // Безопасное объединение классов: если className не передан, добавится пробел, 
  // а .trim() уберет лишние пробелы по краям.
  // Результат будет либо "button", либо "button my-custom-class"
  const finalClassName = `button ${className || ''}`.trim();

  return (
    <button className={finalClassName} {...restProps}>
      {children}
    </button>
  );
};

export default Button;