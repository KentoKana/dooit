import { observer } from "mobx-react-lite";
import { ProjectCreationForm } from "../Forms/ProjectCreationForm";
import { ModalTemplate } from "../ModalTemplate";

export interface IProjectItem {
  title: string;
  description: string;
}

interface IItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newItem: IProjectItem) => void;
}
export const ItemModal = observer(
  ({ isOpen, onClose, onCreate }: IItemModalProps) => {
    return (
      <ModalTemplate isOpen={isOpen} onClose={onClose}>
        <ProjectCreationForm onCreate={onCreate} onClose={onClose} />
      </ModalTemplate>
    );
  }
);
