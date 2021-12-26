import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  useOutsideClick,
} from "@chakra-ui/react";
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
import { ChevronLeftIcon, ChevronRightIcon, LinkIcon } from "@chakra-ui/icons";
import "./style.css";
import { ProjectGetOneDto } from "../../../Dtos/project/ProjectGetOneDto";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { ProjectItemGetDto } from "../../../Dtos/project/ProjectItemGetDto.dto";

SwiperCore.use([Keyboard, Navigation, Pagination, Mousewheel]);
interface IProjectItemsProps {
  data?: ProjectGetOneDto;
}
export const ProjectItems = ({ data }: IProjectItemsProps) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const tagRef = useRef(null);
  const [width, height] = useWindowSize();
  const [items, setItems] = useState<ProjectItemGetDto[]>(
    data?.projectItems ?? []
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{ tagId?: number }>();
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
  }, [data?.projectItems, width, height, imagesLoaded]);
  useOutsideClick({
    ref: tagRef,
    handler: () => {
      setSelectedTag(undefined);
    },
  });
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
        {items?.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <Button variant="unstyled" h="100%" onClick={() => {}}>
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
              </Button>
              {item.tags?.map((tag, index) => {
                return (
                  <Popover
                    isOpen={tag.id === selectedTag?.tagId}
                    onClose={() => setSelectedTag(undefined)}
                    placement="bottom"
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      <Box
                        ref={tagRef}
                        onClick={() => {
                          setSelectedTag({ tagId: tag.id });
                        }}
                        cursor="pointer"
                        key={index}
                        zIndex={3}
                        position="absolute"
                        height="20px"
                        width="20px"
                        borderRadius="50%"
                        border="5px solid"
                        borderColor="primary"
                        top={tag?.yCoordinate}
                        left={tag?.xCoordinate}
                        background="#fff"
                      ></Box>
                    </PopoverTrigger>
                    <PopoverContent width="100%" maxWidth={"200px"}>
                      <PopoverArrow />
                      <PopoverBody>
                        <Box>
                          {tag?.url ? (
                            <a href={tag?.url} target="_blank" rel="noreferrer">
                              <LinkIcon mr={3} />
                              {tag?.title}
                            </a>
                          ) : (
                            <Text textAlign="center">{tag?.title}</Text>
                          )}
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
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
