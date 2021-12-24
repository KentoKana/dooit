import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react/";
import SwiperCore, {
  Keyboard,
  Navigation,
  Pagination,
  Mousewheel,
} from "swiper";

import "swiper/swiper.scss"; // core Swiper
import "swiper/components/navigation/navigation.scss"; // Navigation module
import "swiper/components/scrollbar/scrollbar.scss"; // Navigation module
import "swiper/components/pagination/pagination.scss"; // Navigation module
import { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import "./style.css";
import { ProjectGetOneDto } from "../../../Dtos/project/ProjectGetOneDto";

SwiperCore.use([Keyboard, Navigation, Pagination, Mousewheel]);
interface IProjectItemsProps {
  data?: ProjectGetOneDto;
}
export const ProjectItems = ({ data }: IProjectItemsProps) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <Box mt={7} maxW="600px">
      <Flex justifyContent="end" gap={3}>
        <Button ref={prevRef} variant="unstyled">
          <ChevronLeftIcon fontSize="30px" />
        </Button>
        <Button ref={nextRef} variant="unstyled">
          <ChevronRightIcon fontSize="30px" />
        </Button>
      </Flex>
      <Swiper
        direction="horizontal"
        mousewheel={{ forceToAxis: true }}
        initialSlide={0}
        pagination={{ type: "progressbar" }}
        slidesPerView={1}
        spaceBetween={30}
        keyboard={{
          enabled: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
      >
        {data?.projectItems &&
          data?.projectItems[0].imageUrl &&
          data?.projectItems[0].description &&
          data?.projectItems?.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                <Image src={item.imageUrl} alt={item.description} w="100%" />
                <Box mt={5}>
                  <Text>{item.description}</Text>
                </Box>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </Box>
  );
};
