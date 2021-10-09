import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { FirebaseError } from "@firebase/util";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { UserService } from "../../../classes/UserService";
import { LoadingState } from "../../../enums/LoadingState";
import { UseStores } from "../../../stores/StoreContexts";
import { generateFirebaseAuthErrorMessage } from "../../../utils";

interface IAccountSecurityForm {
  oldPassword: string;
  newPassword: string;
}

export const AccountSecurityForm = observer(() => {
  const toast = useToast();
  const { uiStore, userStore } = UseStores();
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  //#region Local States

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  // const [creationSuccessful, setCreationSuccessful] = useState(false);
  //#endregion
  const onSubmit = useCallback(
    async (formData: IAccountSecurityForm) => {
      setLoadingState(LoadingState.Loading);

      const userService = new UserService(userStore, uiStore);
      userService
        .updateUserPassword(formData.oldPassword, formData.newPassword)
        .then(() => {
          setLoadingState(LoadingState.Loaded);
          toast({
            title: `Your password has been updated!`,
            status: "success",
            isClosable: true,
            position: "top",
          });
        })
        .catch((error: FirebaseError) => {
          setLoadingState(LoadingState.Error);
          console.log(error.code);
          let message = generateFirebaseAuthErrorMessage(error.code);
          if (error.code === "auth/wrong-password") {
            message = "Your old password is incorrect.";
          }

          setError("serverError", {
            type: "server",
            message: message,
          });
          toast({
            title: `Uh oh... :(`,
            description: message,
            status: "error",
            isClosable: true,
            position: "top",
          });
        });
    },
    [uiStore, userStore, setError, toast]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.password} mb={3}>
        <FormLabel htmlFor="old-password" mr={0} mb={2}>
          Old Password:{" "}
        </FormLabel>
        <Input
          disabled={loadingState === LoadingState.Loading}
          id="old-password"
          type="password"
          placeholder="Old Password"
          {...register("oldPassword", {
            required: "Please enter your old password.",
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.password} mb={3}>
        <FormLabel htmlFor="new-password" mr={0} mb={2}>
          Password:{" "}
        </FormLabel>
        <Input
          disabled={loadingState === LoadingState.Loading}
          id="new-password"
          type="password"
          placeholder="New Password"
          {...register("newPassword", {
            required: "Please enter your new password.",
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.serverError}>
        <FormErrorMessage justifyContent="center">
          {errors.serverError && errors.serverError.message}
        </FormErrorMessage>
      </FormControl>
      <Flex justifyContent="center">
        <Button
          onClick={() => {
            clearErrors(["serverError"]);
          }}
          isLoading={loadingState === LoadingState.Loading}
          type="submit"
          variant="primary"
          mt="5"
          width="100%"
          disabled={loadingState === LoadingState.Loading}
        >
          Save
        </Button>
      </Flex>
    </form>
  );
});
