import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col,
    Carousel,
    CarouselItem,
    CarouselIndicators,
} from "reactstrap";

// core components

const items = [
    {
        src: require("../assets/img/carousel/1.jpeg"),
        altText: "carousel-1",
    },
    {
        src: require("../assets/img/carousel/2.jpeg"),
        altText: "carousel-2",
    },
    {
        src: require("../assets/img/carousel/3.jpeg"),
        altText: "carousel-3",
    },
    {
        src: require("../assets/img/carousel/4.jpeg"),
        altText: "carousel-4",
    },
    {
        src: require("../assets/img/carousel/5.jpeg"),
        altText: "carousel-5",
    },
];

function CarouselSection() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [animating, setAnimating] = React.useState(false);
    const onExiting = () => {
        setAnimating(true);
    };
    const onExited = () => {
        setAnimating(false);
    };
    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };
    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };
    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };
    return (
        <>
            <div className="section" id="carousel">
                <h3 className="title" id="sobre">
                    Fotos <i className="fa fa-camera"></i>
                </h3>
                <Row className="justify-content-center">
                    <Col lg="8" md="12">
                        <Carousel
                            activeIndex={activeIndex}
                            next={next}
                            previous={previous}
                        >
                            <CarouselIndicators
                                items={items}
                                activeIndex={activeIndex}
                                onClickHandler={goToIndex}
                            />
                            {items.map((item) => {
                                return (
                                    <CarouselItem
                                        onExiting={onExiting}
                                        onExited={onExited}
                                        key={item.src}
                                    >
                                        <img src={item.src} alt={item.altText} />
                                    </CarouselItem>
                                );
                            })}
                            <a
                                className="carousel-control-prev"
                                data-slide="prev"
                                href="#n"
                                onClick={(e) => {
                                    e.preventDefault();
                                    previous();
                                }}
                                role="button"
                            >
                                <i className="now-ui-icons arrows-1_minimal-left"></i>
                            </a>
                            <a
                                className="carousel-control-next"
                                data-slide="next"
                                href="#n"
                                onClick={(e) => {
                                    e.preventDefault();
                                    next();
                                }}
                                role="button"
                            >
                                <i className="now-ui-icons arrows-1_minimal-right"></i>
                            </a>
                        </Carousel>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default CarouselSection;
