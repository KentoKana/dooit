import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import {
  Box,
  Flex,
  FormErrorMessage,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LoadingState } from "../../../enums/LoadingState";
import { UseStores } from "../../../stores/StoreContexts";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { UserService } from "../../../classes/UserService";
import { generateFirebaseAuthErrorMessage } from "../../../utils";
import { HttpError } from "../../../Dtos/HttpError.dto";
import { UserEditDto } from "../../../Dtos/UserEditDto.dto";
import { UserProfileViewDto } from "../../../Dtos/UserProfileViewDto.dto";
import { useMutation } from "react-query";

interface IProfileEditForm {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  title?: string;
}
interface IUserProfileFormProp {
  data: UserProfileViewDto;
}
export const UserProfileForm = observer(({ data }: IUserProfileFormProp) => {
  const { uiStore, userStore } = UseStores();
  const userService = new UserService(userStore, uiStore);
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  //#region Local States
  const toast = useToast();
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  //#endregion
  const onError = (err: HttpError) => {
    setLoadingState(LoadingState.Error);
    setError("serverError", {
      type: "server",
      message: generateFirebaseAuthErrorMessage(err.status),
    });
    toast({
      title: `Uh oh... :(`,
      description: generateFirebaseAuthErrorMessage(err.status),
      status: "error",
      isClosable: true,
      position: "top",
    });
  };
  const onSuccess = (dto: UserEditDto) => {
    setLoadingState(LoadingState.Loaded);
    toast({
      title: `Successfully updated your profile!`,
      status: "success",
      isClosable: true,
      position: "top",
    });
  };
  const { mutate } = useMutation(
    async (userEditDto: UserEditDto) => {
      return await userService.updateUserProfile(userEditDto);
    },
    {
      onError: onError,
      onSuccess: onSuccess,
    }
  );
  const onSubmit = useCallback(
    async (formData: IProfileEditForm) => {
      setLoadingState(LoadingState.Loading);
      let userEditDto = new UserEditDto();
      const { email, firstName, lastName, bio, title } = formData;
      userEditDto = {
        email,
        firstName,
        lastName,
        profile: {
          bio,
          title,
        },
      };
      mutate(userEditDto);
    },
    [mutate]
  );

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.firstName} mb={3}>
          <FormLabel htmlFor="firstName" mr={0} mb={2}>
            First Name:{" "}
          </FormLabel>
          <Input
            defaultValue={data.firstName}
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
            defaultValue={data.lastName}
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
        <FormControl isInvalid={errors.title} mb={3}>
          <FormLabel htmlFor="title" mr={0} mb={2}>
            Title:{" "}
          </FormLabel>
          <Input
            defaultValue={data.profile.title}
            disabled={loadingState === LoadingState.Loading}
            id="title"
            type="text"
            placeholder="Title"
            {...register("title")}
          />
          <FormErrorMessage>
            {errors.title && errors.title.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email} mb={3}>
          <FormLabel htmlFor="email" mr={0} mb={2}>
            E-mail:{" "}
          </FormLabel>
          <Input
            defaultValue={data.email}
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
        <FormControl isInvalid={errors.bio} mb={3}>
          <FormLabel htmlFor="bio" mr={0} mb={2}>
            Bio:{" "}
          </FormLabel>
          <Textarea
            defaultValue={data.profile.bio}
            disabled={loadingState === LoadingState.Loading}
            id="bio"
            placeholder="Bio"
            {...register("bio")}
          />
          <FormErrorMessage>
            {errors.bio && errors.bio.message}
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
    </Box>
  );
});
