interface IRequiredLabelProps {
  text: string;
  icon?: React.ReactNode;
}

function RequiredLabel(props: IRequiredLabelProps) {
  const { text, icon } = props;
  return (
    <span className="flex items-center">
      {text}
      <span className="text-error-100">*</span>
      {icon}
    </span>
  );
}

export default RequiredLabel;
