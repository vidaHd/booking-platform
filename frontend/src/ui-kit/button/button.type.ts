export enum VariantType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  ICON = "icon",
}

export enum buttonType {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset",
}
export interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant: VariantType;
  type?: buttonType;
  disabled?: boolean;
}
