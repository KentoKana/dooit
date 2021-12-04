import { FormControl } from "@chakra-ui/form-control";
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
import { useMutation } from "react-query";
import { FormElement } from "../FormElement";
import { UserEditDto } from "../../../Dtos/user/UserEditDto.dto";
import { UserProfileViewDto } from "../../../Dtos/user/UserProfileViewDto.dto";

interface IProfileEditForm {
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  title?: string;
}
interface IUserProfileFormProp {
  data: UserProfileViewDto;
  onFormSave: () => void;
}
export const UserProfileForm = observer(
  ({ data, onFormSave }: IUserProfileFormProp) => {
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
      onFormSave();
    };
    const { mutate } = useMutation(
      async (userEditDto: UserEditDto) => {
        return userService.updateUserProfile(userEditDto);
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
          <FormElement
            isRequired
            formLabel="First Name"
            formFor={"firstName"}
            isInvalid={errors.firstName}
            formField={
              <Input
                defaultValue={data.firstName}
                disabled={loadingState === LoadingState.Loading}
                id="firstName"
                type="text"
                placeholder="First Name"
                {...register("firstName", {
                  required: "Please enter your first name.",
                })}
              />
            }
            errorMessage={errors.firstName && errors.firstName.message}
          />
          <FormElement
            isRequired
            formLabel="Last Name"
            formFor={"lastName"}
            isInvalid={errors.lastName}
            formField={
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
            }
            errorMessage={errors.lastName && errors.lastName.message}
          />
          <FormElement
            formLabel="Title"
            formFor={"title"}
            isInvalid={errors.title}
            formField={
              <Input
                defaultValue={data.profile?.title}
                disabled={loadingState === LoadingState.Loading}
                id="title"
                type="text"
                placeholder="Title"
                {...register("title")}
              />
            }
            errorMessage={errors.title && errors.title.message}
          />
          <FormElement
            isRequired
            formLabel="Email"
            formFor={"email"}
            isInvalid={errors.email}
            formField={
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
            }
            errorMessage={errors.email && errors.email.message}
          />
          <FormElement
            formLabel="Bio"
            formFor={"bio"}
            isInvalid={errors.bio}
            formField={
              <Textarea
                defaultValue={data.profile?.bio}
                disabled={loadingState === LoadingState.Loading}
                id="bio"
                placeholder="Bio"
                {...register("bio")}
              />
            }
            errorMessage={errors.serverError && errors.serverError.message}
          />
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
  }
);
