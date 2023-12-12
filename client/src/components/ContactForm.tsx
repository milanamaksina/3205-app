import React, { useState, type FC } from "react";
import "./ContactForm.scss";
import InputMask from "react-input-mask";
import { Contact } from "../models/contact";
import { SubmitHandler, useForm } from "react-hook-form";
import { ValidationContactForm } from "./ContactFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

export interface ContactForm {
  setUsers: React.Dispatch<React.SetStateAction<Contact[]>>;
}

export const ContactForm: FC<ContactForm> = ({ setUsers }) => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<Contact>({
    resolver: yupResolver(ValidationContactForm()),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: Contact) => {
    setIsLoading(true);

    axios
      .post(`http://localhost:3001/search`, data)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFormSubmit: SubmitHandler<Contact> = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="contact-form">
        <div className="input-validation-container">
          <div className="input-wrapper">
            <input type="text" id="email" {...register("email")} />
            <label htmlFor="user">
              Email{<span className="required">*</span>}
            </label>
          </div>
          {errors.email && errors.email.message && (
            <span>{errors.email.message}</span>
          )}
        </div>
        <div className="input-validation-container">
          <div className="input-wrapper">
            <InputMask
              mask="99-99-99"
              maskChar=" "
              type="text"
              id="number"
              {...register("number")}
              className="your-custom-input-class"
            />
            <label htmlFor="number">Phone</label>
          </div>
          {errors.number && errors.number.message && (
            <span>{errors.number.message}</span>
          )}
        </div>
        <button className="submit-btn" type="submit">
          {isLoading ? "Loading..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
