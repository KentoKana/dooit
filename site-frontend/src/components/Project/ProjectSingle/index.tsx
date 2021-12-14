import { useParams } from "react-router";
import { useGetProjectById } from "../../../hooks/data/useGetProjectById";
import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react/";
import SwiperCore, { Keyboard, Navigation, Pagination } from "swiper";

import "swiper/swiper.scss"; // core Swiper
import "swiper/components/navigation/navigation.scss"; // Navigation module
import "swiper/components/scrollbar/scrollbar.scss"; // Navigation module
import "swiper/components/pagination/pagination.scss"; // Navigation module

SwiperCore.use([Keyboard, Navigation, Pagination]);

export const ProjectSingle = () => {
  const { projectId } = useParams<{ username: string; projectId: string }>();

  const project = useGetProjectById(parseInt(projectId));
  const { data } = project;
  return (
    <Box>
      <Flex>
        <Box width="30%" p={5} pt={0}>
          <Heading my={7}>{data?.name}</Heading>
          <Text>{data?.description}</Text>
        </Box>
        <Box width="70%" p={5} pt={0} display="flex" justifyContent="center">
          <Box mt={7} maxW="600px">
            <Swiper
              initialSlide={2}
              pagination={{ type: "progressbar" }}
              slidesPerView={1}
              spaceBetween={30}
              keyboard={{
                enabled: true,
              }}
              navigation={true}
            >
              {data?.projectItems &&
                data?.projectItems[0].imageUrl &&
                data?.projectItems[0].description &&
                data?.projectItems?.map((item) => {
                  return (
                    <SwiperSlide key={item.id}>
                      <Image
                        src={item.imageUrl}
                        alt={item.description}
                        w="100%"
                      />
                      <Box mt={5}>
                        <Text>{item.description}</Text>
                      </Box>
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
