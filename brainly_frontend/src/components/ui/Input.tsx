import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}


const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, ...rest }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          placeholder={placeholder}
          type="text"
          className="px-25 py-2 border rounded my-2"
          {...rest} 
        />
      </div>
    );
  }
);

export default Input;
