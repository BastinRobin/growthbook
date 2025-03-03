import clsx from "clsx";
import { useState } from "react";
import { Children, FC, isValidElement, ReactNode } from "react";
import Modal from "../Modal";

type Props = {
  header: string;
  submitColor?: string;
  cta?: string;
  closeCta?: string;
  size?: "md" | "lg" | "max";
  navStyle?: "pills" | "underlined" | "tabs";
  navFill?: boolean;
  inline?: boolean;
  close: () => void;
  submit: () => Promise<void>;

  step: number;
  setStep: (step: number) => void;
};

const PagedModal: FC<Props> = (props) => {
  const {
    step,
    setStep,
    children,
    submit,
    navStyle,
    navFill,
    cta,
    ...passThrough
  } = props;

  const [error, setError] = useState("");

  const steps: {
    display: string;
    enabled: boolean;
    validate?: () => Promise<void>;
  }[] = [];
  let content: ReactNode;
  let nextStep: number = null;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const { display, enabled, validate } = child.props;
    if (content && enabled !== false && !nextStep) {
      nextStep = steps.length;
    }
    if (step === steps.length) {
      content = <>{child}</>;
    }
    steps.push({ display, enabled, validate });
  });

  async function validateSteps(before?: number) {
    before = before ?? steps.length;
    for (let i = 0; i < before; i++) {
      if (steps[i].enabled === false) continue;
      if (!steps[i].validate) continue;
      console.log("Validating step", i);
      try {
        await steps[i].validate();
      } catch (e) {
        setStep(i);
        throw e;
      }
    }
  }

  const navStyleClass = navStyle ? "nav-" + navStyle : "nav-pills";

  const navFillClass =
    typeof navFill === "undefined" ? "nav-fill" : navFill ? "nav-fill" : "";

  return (
    <Modal
      open={true}
      {...passThrough}
      submit={async () => {
        await validateSteps(nextStep);
        if (!nextStep) {
          await submit();
          props.close();
        } else {
          setStep(nextStep);
        }
      }}
      error={error}
      autoCloseOnSubmit={false}
      cta={!nextStep ? cta : "Next"}
    >
      <nav
        className={`nav mb-4 justify-content-start ${navStyleClass} ${navFillClass}`}
      >
        {steps.map(({ display, enabled }, i) => (
          <a
            key={i}
            href="#"
            className={clsx("w-md-100 nav-item nav-link", {
              active: step === i,
              disabled: enabled === false,
            })}
            onClick={async (e) => {
              e.preventDefault();
              setError("");
              try {
                await validateSteps(i);
                setStep(i);
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            {i + 1}. {display}
          </a>
        ))}
      </nav>
      {content}
    </Modal>
  );
};

export default PagedModal;
