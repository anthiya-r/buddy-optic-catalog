'use client';

import { API_URLS } from '@/constants/url';
import { getFirstImage } from '@/lib/ui-helpers';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';
import { PropsWithChildren, useEffect, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

type Props = {
  photo: string;
  name: string;
  color: string;
  category: string;
};

export const Overlay = ({ children }: PropsWithChildren) => {
  return (
    <div className="absolute left-0 bottom-0 p-2 w-full min-h-24 text-sm text-slate-300 z-50 bg-black/50">
      {children}
    </div>
  );
};

const FullScreenIcon = (props: React.HTMLAttributes<any>) => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  useEffect(() => {
    document.onfullscreenchange = () => {
      setFullscreen(Boolean(document.fullscreenElement));
    };
  }, []);
  return (
    <svg
      className="PhotoView-Slider__toolbarIcon"
      fill="white"
      width="44"
      height="44"
      viewBox="0 0 768 768"
      {...props}
    >
      {fullscreen ? (
        <path d="M511.5 256.5h96v63h-159v-159h63v96zM448.5 607.5v-159h159v63h-96v96h-63zM256.5 256.5v-96h63v159h-159v-63h96zM160.5 511.5v-63h159v159h-63v-96h-96z" />
      ) : (
        <path d="M448.5 160.5h159v159h-63v-96h-96v-63zM544.5 544.5v-96h63v159h-159v-63h96zM160.5 319.5v-159h159v63h-96v96h-63zM223.5 448.5v96h96v63h-159v-159h63z" />
      )}
    </svg>
  );
};

const ProductView = ({ photo, name, color, category }: Props) => {
  const imageList = photo?.split(',').filter(Boolean) ?? [];
  console.log('🚀 ~ ProductView ~ imageList:', imageList);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const firstImage = getFirstImage(photo);
  const isPlaceholder = firstImage === '/placeholder.svg';

  function toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const element = document.querySelector('.PhotoView-Portal');
      if (element) {
        element.requestFullscreen();
      }
    }
  }

  return (
    <PhotoProvider
      toolbarRender={({ rotate, onRotate, onScale, scale, index }) => {
        return (
          <>
            <svg
              className="PhotoView-Slider__toolbarIcon"
              width="44"
              height="44"
              viewBox="0 0 768 768"
              fill="white"
              onClick={() => onScale(scale + 0.5)}
            >
              <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM415.5 223.5v129h129v63h-129v129h-63v-129h-129v-63h129v-129h63z" />
            </svg>
            <svg
              className="PhotoView-Slider__toolbarIcon"
              width="44"
              height="44"
              viewBox="0 0 768 768"
              fill="white"
              onClick={() => onScale(scale - 0.5)}
            >
              <path d="M384 640.5q105 0 180.75-75.75t75.75-180.75-75.75-180.75-180.75-75.75-180.75 75.75-75.75 180.75 75.75 180.75 180.75 75.75zM384 64.5q132 0 225.75 93.75t93.75 225.75-93.75 225.75-225.75 93.75-225.75-93.75-93.75-225.75 93.75-225.75 225.75-93.75zM223.5 352.5h321v63h-321v-63z" />
            </svg>
            <svg
              className="PhotoView-Slider__toolbarIcon"
              onClick={() => onRotate(rotate + 90)}
              width="44"
              height="44"
              fill="white"
              viewBox="0 0 768 768"
            >
              <path d="M565.5 202.5l75-75v225h-225l103.5-103.5c-34.5-34.5-82.5-57-135-57-106.5 0-192 85.5-192 192s85.5 192 192 192c84 0 156-52.5 181.5-127.5h66c-28.5 111-127.5 192-247.5 192-141 0-255-115.5-255-256.5s114-256.5 255-256.5c70.5 0 135 28.5 181.5 75z" />
            </svg>
            {document.fullscreenEnabled && <FullScreenIcon onClick={toggleFullScreen} />}
          </>
        );
      }}
      overlayRender={() => (
        <Overlay>
          <div className="flex flex-col gap-2  p-4">
            <p className="text-xl">รุ่น: {name}</p>
            <p className="text-xl">สี: {color}</p>
            <p className="text-xl">หมวดหมู่: {category}</p>
          </div>
        </Overlay>
      )}
    >
      {imageList.map((imgSrc, index) => {
        const isFailed = failedImages.has(index);
        const imageUrl = `${API_URLS.IMAGES.GET(imgSrc)}`;

        return (
          <PhotoView key={index} src={imageUrl}>
            {index === 0 ? (
              <div className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100">
                {isPlaceholder ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageOff className="h-16 w-16 text-gray-400" />
                  </div>
                ) : isFailed ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                    <ImageOff className="h-16 w-16" />
                  </div>
                ) : (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="100vw"
                    className="object-cover object-center  cursor-pointer group-hover:scale-110 transition"
                    onError={() => setFailedImages((prev) => new Set(prev).add(index))}
                  />
                )}
              </div>
            ) : undefined}
          </PhotoView>
        );
      })}
    </PhotoProvider>
  );
};

export default ProductView;
