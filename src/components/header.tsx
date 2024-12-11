"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import style from "./header.module.css";
import { MdLogout } from "react-icons/md";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";

const menuList = [
  "뉴클래식",
  "드라마",
  "예능",
  "영화",
  "애니",
  "해외시리즈",
  "시사교양",
  "키즈",
  "영화플러스",
  "live",
];

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputAnimation = useAnimation();
  const router = useRouter();

  const alertEvent = () => {
    alert("아직 준비중인 서비스입니다.");
  };

  const handleLogout = () => {
    const confirm = window.confirm("로그아웃 하시겠습니까?");
    if (confirm) {
      setIsLoggedIn(false);
    }
  };

  const openSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({
        scaleX: 1,
      });
    }
    setSearchOpen((prev) => !prev);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }

    inputAnimation.start({
      scaleX: 0,
    });
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={style.container}>
      <div className={style.logo}>
        <Link href={"/"}>
          <img src="/logowhite.png" alt="wavve" />
        </Link>
      </div>
      <ul className="menuarea">
        {menuList.map((it, idx) => (
          <li key={idx} onClick={() => alert("아직 준비중인 서비스입니다.")}>
            {it}
          </li>
        ))}
      </ul>
      <form className={style.searchbox} onSubmit={handleSearch}>
        <motion.input
          type="text"
          placeholder="영화, 드라마 검색"
          animate={inputAnimation}
          initial={{ scaleX: 0 }}
          transition={{ type: "linear" }}
          value={searchQuery}
          onChange={(e: React.FormEvent<HTMLFormElement>) =>
            setSearchQuery(e.currentTarget.value)
          }
        />
        <motion.div
          onClick={openSearch}
          animate={{ x: searchOpen ? -168 : 0, y: 1 }}
          transition={{ type: "linear" }}
        >
          <FaSearch size={18} />
        </motion.div>
      </form>
      <div className={style.loginauth}>
        {isLoggedIn ? (
          <div onClick={handleLogout}>
            <MdLogout size={22} />
          </div>
        ) : (
          <Link href={"/login"}>
            <FaUser size={18} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
