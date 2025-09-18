import axios from "axios";

export function validateNumericInput(value, field) {
  const validPattern = /^-?\d*\.?\d*$/;
  return validPattern.test(value) || value === "";
}

export function validateCalculatorInput(value) {
  const validPattern = /^[\d\s+\-*/.()]*$/;
  return validPattern.test(value);
}

export async function fetchFurnitori() {
  const response = await axios.get("/furnitori.json");
  return response.data.map((item) => ({
    value: item.key,
    label: item.Name,
  }));
}