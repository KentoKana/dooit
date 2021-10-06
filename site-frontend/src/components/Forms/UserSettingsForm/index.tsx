import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { Box, Flex, FormErrorMessage } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LoadingState } from "../../../enums/LoadingState";
import { useResetQuery } from "../../../hooks/useResetQuery";
import { AuthService } from "../../../classes/AuthService";
import { UseStores } from "../../../stores/StoreContexts";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";

interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export const UserSettingsForm = observer(() => {
  const { uiStore, userStore } = UseStores();
  const reset = useResetQuery();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  //#region Local States

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  //#endregion
  const onSubmit = useCallback(
    async (formData: ISignUpForm) => {
      setLoadingState(LoadingState.Loading);
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
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       setLoadingState(LoadingState.Error);
      //       reset();
      //     });
    },
    [uiStore, userStore, reset]
  );

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.firstName} mb={3}>
          <FormLabel htmlFor="firstName" mr={0} mb={2}>
            First Name:{" "}
          </FormLabel>
          <Input
            defaultValue={userStore.user?.firstName}
            id="firstName"
            disabled={loadingState === LoadingState.Loading}
            placeholder="First Name"
            {...register("firstName", {
              required: "Please enter your first name.",
            })}
          />
          <FormErrorMessage>
            {errors.firstName && errors.firstName.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.lastName} mb={3}>
          <FormLabel htmlFor="lastName" mr={0} mb={2}>
            Last Name:{" "}
          </FormLabel>
          <Input
            defaultValue={userStore.user?.lastName}
            disabled={loadingState === LoadingState.Loading}
            id="lastName"
            type="text"
            placeholder="Last Name"
            {...register("lastName", {
              required: "Please enter your last name.",
            })}
          />
          <FormErrorMessage>
            {errors.lastName && errors.lastName.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email} mb={3}>
          <FormLabel htmlFor="email" mr={0} mb={2}>
            E-mail:{" "}
          </FormLabel>
          <Input
            defaultValue={userStore.user?.email}
            disabled={loadingState === LoadingState.Loading}
            id="email"
            type="text"
            placeholder="E-mail"
            {...register("email", {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
              required: "Please enter your e-mail.",
            })}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
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
    </Box>
  );
});
