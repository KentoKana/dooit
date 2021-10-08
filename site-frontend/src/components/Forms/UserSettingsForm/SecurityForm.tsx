import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingState } from "../../../enums/LoadingState";
import { UseStores } from "../../../stores/StoreContexts";
import { isNullOrUndefined } from "../../../utils";

export const AccountSecurityForm = observer(() => {
  const { uiStore, userStore } = UseStores();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  //#region Local States

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  // const [creationSuccessful, setCreationSuccessful] = useState(false);
  //#endregion
  const onSubmit = useCallback(
    async (formData: any) => {
      //   setLoadingState(LoadingState.Loading);
      //   const authService = new AuthService(userStore, uiStore);
      //   authService
      //     .createUserWithEmailAndPassword({
      //       firstName: formData.firstName,
      //       lastName: formData.lastName,
      //       password: formData.password,
      //       email: formData.email,
      //     })
      //     .then(() => {
      //       setLoadingState(LoadingState.Loaded);
      //       setCreationSuccessful(true);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       setLoadingState(LoadingState.Error);
      //       reset();
      //     });
    },
    [uiStore, userStore]
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
          {...register("old-password", {
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
          {...register("new-password", {
            required: "Please enter your new password.",
          })}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <Flex justifyContent="center">
        <Button
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
