export enum VariantType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ICON = "icon",
}

export enum InputType {
  TEXT = "text",
  PASSWORD = "password",
  NUMBER = "number",
  EMAIL = "email",
  SERACH = "search",
}
export interface InputProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant: VariantType;
  type?: InputType;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}
