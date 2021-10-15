import { observer } from "mobx-react-lite";
import { ProjectItemCreationForm } from "../Forms/ProjectCreationForm/ProjectItemCreationForm";
import { ModalTemplate } from "../ModalTemplate";

export interface IProjectItem {
  title: string;
  description: string;
  imageUrl?: string;
  alt?: string;
  image?: File;
  order: number;
  progress?: number;
}

interface IItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreate: (newItem: IProjectItem) => void;
}
export const ItemModal = observer(
  ({ isOpen, onClose, onItemCreate }: IItemModalProps) => {
    return (
      <ModalTemplate isOpen={isOpen} onClose={onClose}>
        <ProjectItemCreationForm
          onItemCreate={onItemCreate}
          onClose={onClose}
        />
      </ModalTemplate>
    );
  }
);
