import { Box, Flex, Text, Image, Button, Tag } from "@chakra-ui/react";
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
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import "./style.css";
import { ProjectGetOneDto } from "../../../Dtos/project/ProjectGetOneDto";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { ProjectItemGetDto } from "../../../Dtos/project/ProjectItemGetDto.dto";
import { ImageTagPopover } from "./ImageTagPopover";

SwiperCore.use([Keyboard, Navigation, Pagination, Mousewheel]);
interface IProjectItemsProps {
  data?: ProjectGetOneDto;
}
export const ProjectItems = ({ data }: IProjectItemsProps) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [width, height] = useWindowSize();
  const [items, setItems] = useState<ProjectItemGetDto[]>(
    data?.projectItems ?? []
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [displayTags, setDisplayTags] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  // Rerender on window size change.
  useEffect(() => {
    if (data) {
      setItems([
        ...(data?.projectItems.map((item) => {
          const tags =
            item.tags?.map((tag) => {
              const scaleFactor =
                (imageRef.current?.offsetWidth ?? 1) / (tag.width ?? 1);
              return {
                ...tag,
                xCoordinate: (tag.xCoordinate ?? 0) * scaleFactor,
                yCoordinate: (tag.yCoordinate ?? 0) * scaleFactor,
              };
            }) ?? [];

          return {
            ...item,
            tags: [...tags],
          };
        }) ?? []),
      ]);
    }
  }, [data?.projectItems, width, height, imagesLoaded, currentSlide]);

  return (
    <Box mt={7} maxW="700px" w="100%" position="relative">
      <Flex
        justifyContent="end"
        gap={3}
        position="absolute"
        top="-40px"
        right="0"
      >
        <Button ref={prevRef} variant="unstyled">
          <ChevronLeftIcon fontSize="30px" />
        </Button>
        <Button ref={nextRef} variant="unstyled">
          <ChevronRightIcon fontSize="30px" />
        </Button>
      </Flex>
      <Swiper
        onActiveIndexChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex);
        }}
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
        onSlideChange={() => {
          setDisplayTags(false);
        }}
      >
        {items?.map((item, projectIndex) => {
          return (
            <SwiperSlide key={item.id}>
              <Button
                variant="unstyled"
                h="100%"
                onClick={() => {
                  setDisplayTags((prev) => !prev);
                }}
              >
                <Image
                  position="relative"
                  id={`image_${item.id}`}
                  src={item.imageUrl}
                  alt={item.description}
                  w="100%"
                  ref={imageRef}
                  onLoad={() => {
                    setImagesLoaded(true);
                  }}
                />
                {item.tags?.some((tag) => tag) && (
                  <Tag
                    position="absolute"
                    bottom="0"
                    right="0"
                    m={2}
                    background="rgba(0,0,0,0.4)"
                    color="#fff"
                  >
                    Tap to {displayTags ? "hide" : "show"} tags
                  </Tag>
                )}
              </Button>
              {projectIndex === currentSlide &&
                item.tags?.map((tag) => {
                  return (
                    <ImageTagPopover
                      displayTags={displayTags}
                      tag={tag}
                      key={tag.id}
                    />
                  );
                })}

              {item.description && (
                <Box mt={5}>
                  <Text>{item.description}</Text>
                </Box>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};
