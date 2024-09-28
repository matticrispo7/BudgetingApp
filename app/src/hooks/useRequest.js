import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  /* PROPS:
        - url 
        - method
        - body 
        - onSuccess => callback run if the request is successfull
     */

  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null); // reset previous errors
      const response = await axios[method](url, body);

      // if the callback is provided => run it
      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        // prerendered JSX to return to show errors
        <div className="alert alert-danger">
          <h4>Error</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
