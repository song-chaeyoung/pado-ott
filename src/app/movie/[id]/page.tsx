"use client";

import React from "react";
import style from "@/styles/detail-modal.module.css";
import { IMovieData, ITrailerResults } from "@/types";
import adultBadge from "@/images/adultTrueBadge.svg";
import adultFalseBadge from "@/images/adultFalseBadge.svg";
import { FaPlay } from "react-icons/fa";

import { FaStar } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { TbMovieOff } from "react-icons/tb";
import Image from "next/image";
import TrailerItem from "@/components/trailer-item";
import Link from "next/link";
import MenuIndicator from "@/components/menu-indicator";
import BackButton from "@/components/back-button";

const DetailModal = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ route: string }>;
}) => {
  const urls = [
    `${process.env.NEXT_PUBLIC_TMDB_BASE_PATH}/movie/${
      (await params).id
    }?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`,
    `${process.env.NEXT_PUBLIC_TMDB_BASE_PATH}/movie/${
      (await params).id
    }/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`,
  ];

  const responses = urls.map((url) =>
    fetch(url).then((response) => response.json())
  );

  const [data, trailerData] = (await Promise.all(responses)) as [
    IMovieData,
    ITrailerResults
  ];

  let routeSwitcher;
  switch ((await searchParams).route) {
    case "reviews":
      routeSwitcher = "reviews";
      break;
    case "similar":
      routeSwitcher = "similar";
      break;
    default:
      routeSwitcher = "null";
  }

  return (
    <div className={style.wrapper}>
      <div className={style.inner}>
        <div
          className={style.detailBanner}
          style={{
            background: data.backdrop_path
              ? `linear-gradient(to right, #162447 20%, rgba(0, 0, 0, 0.1)), url(https://media.themoviedb.org/t/p/original/${data.backdrop_path}) 200px center/cover no-repeat`
              : `linear-gradient(to right, #162447 20%, rgba(0, 0, 0, 0.1)), url(https://media.themoviedb.org/t/p/original/${data.poster_path}) 200px center/cover no-repeat `,
          }}
        >
          <BackButton />
          <div className={style.bannerContent}>
            <div className={style.headerDesc}>
              <h1 className={style.descTitle}>
                <span>
                  <FaStar />
                  {parseFloat(data.vote_average).toFixed(2)}
                </span>
                {data?.title || data?.original_title}
                <div className={style.genre}>
                  {data?.genres?.map((item, i, arr) => (
                    <span className={style.genreItem} key={i}>
                      {i === arr.length - 1 ? item.name : `${item.name} | `}
                    </span>
                  ))}
                  <Image
                    src={data.adult ? adultBadge : adultFalseBadge}
                    alt="연령등급"
                    className={style.adultBadge}
                  />
                </div>
              </h1>
              <div className={style.descContentContainer}>
                <div className={style.descContent}>
                  <div className={style.playButtonContainer}>
                    <button
                      className={style.playButton}
                      onClick={() => alert("준비중인 서비스입니다.")}
                    >
                      <FaPlay size={16} />
                    </button>
                    <span>트레일러 보기</span>
                  </div>
                  <div className={style.quickMenu}>
                    {/* <div className={style.quickMenuItem}>
                      <CiStar size={28} strokeWidth={0.8} />
                      <span>리뷰 남기기</span>
                    </div> */}
                    <div className={style.quickMenuItem}>
                      <CiHeart size={28} strokeWidth={0.8} />
                      <span>보고 싶어요</span>
                    </div>
                  </div>
                </div>
                <p className={style.descOverview}>{data?.overview}</p>
              </div>
            </div>
            <img
              className={style.headerImg}
              src={`https://media.themoviedb.org/t/p/original/${data?.poster_path}`}
              alt="thumbnail"
            />
          </div>
        </div>
        <div className={style.detailContent}>
          <nav className={style.modalMenu}>
            <ul>
              <li>
                <Link
                  className={
                    routeSwitcher === "null" ? style.active : undefined
                  }
                  href={`/movie/${data.id}`}
                >
                  트레일러 {routeSwitcher === "null" && <MenuIndicator />}
                </Link>
              </li>
              {/* <li>
                <Link
                  className={
                    routeSwitcher === "reviews" ? style.active : undefined
                  }
                  href={`/movie/${data.id}?route=reviews`}
                >
                  평가/리뷰 {routeSwitcher === "reviews" && <MenuIndicator />}
                </Link>
              </li> */}
              <li>
                <Link
                  className={
                    routeSwitcher === "similar" ? style.active : undefined
                  }
                  href={`/movie/${data.id}?route=similar`}
                >
                  비슷한 작품
                  {routeSwitcher === "similar" && <MenuIndicator />}
                </Link>
              </li>
            </ul>
          </nav>
          {routeSwitcher === "null" && (
            <>
              <h2 className={style.contentTitle}>
                {data.title}{" "}
                <span>
                  총{" "}
                  {
                    trailerData.results.filter(
                      (item) =>
                        item.site && item.site.toLowerCase() === "youtube"
                    ).length
                  }
                  개
                </span>
              </h2>
              <div
                className={
                  trailerData.results.length > 0
                    ? style.trailersContainer
                    : `${style.trailersContainer} ${style.noTrailers}`
                }
              >
                {trailerData.results.length > 0 ? (
                  trailerData.results
                    .filter(
                      (item) =>
                        item.site && item.site.toLowerCase() === "youtube"
                    )
                    .map((trailer) => (
                      <TrailerItem
                        key={trailer.key}
                        trailerKey={trailer.key}
                        name={trailer.name}
                        published_at={trailer.published_at}
                      />
                    ))
                ) : (
                  <div className={style.noTrailer}>
                    <TbMovieOff size={300} strokeWidth={1} color="#555" />
                    <span>트레일러가 존재하지 않습니다.</span>
                  </div>
                )}
              </div>

              {/* <div className={style.language}>
              <b>언어: </b>
              {data?.original_language}
            </div> */}
              {/* <div className={style.popularity}>
              <b>인기점수: </b>
              <i style={{ textDecoration: "underline", fontStyle: "italic" }}>
                {data?.popularity} / 10000점
              </i>
            </div> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
