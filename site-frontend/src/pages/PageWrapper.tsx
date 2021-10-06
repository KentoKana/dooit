import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";

interface IPageWrapperProps {
  children: ReactNode;
}
export const PageWrapper = observer(({ children }: IPageWrapperProps) => {
  return <Box p="5">{children}</Box>;
});
