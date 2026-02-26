// export const mediaItems = [
//   // ---------------- Graphic ----------------
//   ...[
//     { url: "https://i.pinimg.com/736x/89/31/42/8931422ecd79996e96186f25c6532ad1.jpg", tags: ["Illustration"] },
//     { url: "https://i.pinimg.com/736x/a7/56/73/a7567356ff78177dc343a078f72e8e72.jpg", tags: ["Poster"] },
//     { url: "https://i.pinimg.com/736x/2b/d2/56/2bd256f2db210b295f15f69be91cbaf8.jpg", tags: ["Poster"] },
//     { url: "https://i.pinimg.com/736x/12/c6/01/12c6017ababea562c4bae894981f7f87.jpg", tags: ["Digital Art"] },
//     { url: "https://i.pinimg.com/736x/37/04/ee/3704ee66d5000d87e46edcf4dbf9ee14.jpg", tags: ["Illustration"] },
//     { url: "https://i.pinimg.com/736x/d9/42/44/d94244db7df3d8655e3e335190e9825c.jpg", tags: ["Illustration"] },
//     { url: "https://i.pinimg.com/736x/19/33/cc/1933ccd9c948efab857661961a7f5c2c.jpg", tags: ["Flyer", "Digital Art"] },
//     { url: "https://i.pinimg.com/736x/fe/68/fd/fe68fd078057b4d394dcce5cdfd15ec2.jpg", tags: ["Digital Art"] },
//     { url: "https://i.pinimg.com/736x/d4/00/b5/d400b536d4501fa21fa833640e805965.jpg", tags: ["Illustration"] },
//     { url: "https://i.pinimg.com/736x/c7/93/bb/c793bbab439ef94ae80d0a872362adb3.jpg", tags: ["Poster"] },
//     { url: "https://i.pinimg.com/736x/c7/93/bb/c793bbab439ef94ae80d0a872362adb3.jpg", tags: ["Rams"] },
//   ].map(item => ({ ...item, type: "graphic" })),

//   // ---------------- Logos ----------------
//   ...[
//     { url: "https://i.pinimg.com/736x/94/d2/43/94d243c0ec911d1e8b4e4aaf248fa7ad.jpg", tags: ["Minimal"] },
//     { url: "https://i.pinimg.com/736x/ed/02/13/ed02134e157b6a636679cee444264fbf.jpg", tags: ["Typography"] },
//     { url: "https://i.pinimg.com/736x/24/b7/f0/24b7f0cb95c222ee244366de5c5a1037.jpg", tags: ["Vintage"] },
//     { url: "https://i.pinimg.com/736x/67/4c/3d/674c3d355b2ad9af830dae5a4ce7b5aa.jpg", tags: ["Vintage"] },
//     { url: "https://i.pinimg.com/1200x/07/f1/46/07f1463fa8f17ac5e3a11c8e967473ad.jpg", tags: ["Mascot"] },
//     { url: "https://i.pinimg.com/736x/0d/51/82/0d51822a1e52d9227880b7d127dc99de.jpg", tags: ["Typography"] },
//     { url: "https://i.pinimg.com/736x/4a/82/d7/4a82d76a4d4bb53b77afb22bf9fe46d6.jpg", tags: ["Minimal"] },
//     { url: "https://i.pinimg.com/736x/a9/45/e2/a945e2a023a0747ef7894830ef468730.jpg", tags: ["Vintage"] },
//   ].map(item => ({ ...item, type: "logos" })),

//   // ---------------- UI Design ----------------
//   ...[
//     { url: "https://i.pinimg.com/736x/29/43/98/294398302c1e627a624b934ee901b14d.jpg", tags: ["Wireframe"] },
//     { url: "https://i.pinimg.com/736x/fa/5f/d4/fa5fd4e882b80f6e1fa0083a39026334.jpg", tags: ["Prototype"] },
//     { url: "https://i.pinimg.com/1200x/b5/f4/8e/b5f48ea8142b932cd58ad9ff8833fc16.jpg", tags: ["Mockup"] },
//     { url: "https://i.pinimg.com/736x/94/cf/ef/94cfef9590fba08c44ced383e8f400a5.jpg", tags: ["Wireframe"] },
//     { url: "https://i.pinimg.com/1200x/1c/19/88/1c19882bad8627a96730a6e99370691f.jpg", tags: ["Prototype"] },
//     { url: "https://i.pinimg.com/736x/39/8f/7b/398f7bc768cd394b34f9584132da76ce.jpg", tags: ["Mockup"] },
//   ].map(item => ({ ...item, type: "uidesign" })),

//   // ---------------- Videos ----------------
//   ...[
//     { url: "https://www.youtube.com/embed/VSRB9oHnwro", tags: ["Intro"] },
//     { url: "https://www.youtube.com/embed/n4OXoaCqyWI", tags: ["Trailer"] },
//     { url: "https://www.youtube.com/embed/iXluKyJet0w", tags: ["Ad"] },
//     { url: "https://www.youtube.com/embed/FhRiDumitdo", tags: ["Intro"] },
//     { url: "https://www.youtube.com/embed/tKMpkKHNFRc", tags: ["Trailer"] },
//     { url: "https://youtube.com/embed/cjsietCaaxU", tags: ["Ad"] },
//     { url: "https://youtube.com/embed/l9njl8gAG5k", tags: ["Animation"] },
//   ].map(item => ({ ...item, type: "video", isVideo: true })),
// ];

// frontend/src/data/mediaItems.js
import axios from "axios";

// ✅ Always use env-based backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function mediaItems() {
  try {
    const res = await axios.get(`${API_BASE}/api/media`);
    return res.data || [];
  } catch (err) {
    console.error("❌ Failed to fetch media:", err);
    return [];
  }
}

