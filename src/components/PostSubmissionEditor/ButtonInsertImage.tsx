import CircleLoading from "@/components/Loading/CircleLoading";
import React, { useState, FC, useEffect } from "react";
import toast from "react-hot-toast";
import { EditorItemImageAttrs } from "./MenuBar";
import ModalUploadImage from "./ModalUploadImage";
import isImageFromUrl from "@/utils/IsImageFromUrl";
import { PencilIcon } from "@heroicons/react/24/outline";
import getTrans from "@/utils/getTrans";
import { NC_SITE_SETTINGS } from "@/contains/site-settings";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface ButtonInsertImageProps {
  className?: string;
  contentClassName?: string;
  onChangeImage?: (image: ImageState) => void;
  defaultImage?: ImageState;
}

export interface ImageState {
  sourceUrl: string;
  databaseId?: number;
  id?: string;
  altText?: string;
}

const ButtonInsertImage: FC<ButtonInsertImageProps> = ({
  className = "flex-1",
  contentClassName = "px-3 py-8",
  onChangeImage = () => {},
  defaultImage = { sourceUrl: "" },
}) => {
  const [imageState, setImageState] = useState<ImageState>(defaultImage);
  let [isOpen, setIsOpen] = useState(false);
  let [isLoading, setisLoading] = useState(false);

  const T = getTrans();
  //
  function closeModal() {
    setIsOpen(false);
    setImageState(defaultImage);
  }
  function openModal() {
    setIsOpen(true);
  }

  const handleApply = ({ url, alt }: EditorItemImageAttrs) => {
    setisLoading(true);

    isImageFromUrl(url)
      .then((value) => {
        if (!value) {
          toast.error(
            T.pageSubmission["The url is not an image, please try again."]
          );
          return;
        }
        onChangeImage({ sourceUrl: url, altText: alt, id: "" });
        setImageState({ sourceUrl: url, altText: alt, id: "" });
        closeModal();
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  const handleFileDelete = () => {
    onChangeImage({ sourceUrl: "", altText: "", id: "" });
    setImageState({ sourceUrl: "", altText: "", id: "" });
    closeModal();
  };
  //

  useEffect(() => {
    setImageState(defaultImage);
  }, [defaultImage.sourceUrl]);

  let LOADING = isLoading;

  return (
    <>
      <div className={className}>
        <div
          className={`block group ${
            LOADING ? "cursor-not-allowed animate-pulse" : "cursor-pointer"
          }`}
        >
          <div
            className={`relative mt-1 flex justify-center border border-neutral-300 group-hover:border-neutral-400 dark:border-neutral-600 border-dashed rounded-xl transition-colors z-0`}
          >
            <div className="flex-1 text-center">
              {!imageState.sourceUrl && (
                <div className="p-2">
                  <div className={`text-center ${contentClassName}`}>
                    <svg
                      className="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>

                    <div className="flex mt-3 justify-center text-sm text-neutral-600 dark:text-neutral-300">
                      <div className=" flex-shrink-0 cursor-pointer  rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                        {LOADING ? (
                          <CircleLoading
                            className="ml-3 text-blue-600 "
                            childClassName="w-5 h-5"
                          />
                        ) : (
                          <span>{T.pageSubmission["Upload a file"]}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PNG, JPG, GIF, WEBP, SVG ...
                    </p>
                  </div>
                </div>
              )}

              {imageState.sourceUrl && (
                <div className="">
                  <img
                    src={imageState.sourceUrl}
                    className="rounded-lg shadow-lg w-full "
                    sizes="(max-width: 475px) 100vw, 600px"
                    alt={imageState.altText || "image"}
                  />
                </div>
              )}
            </div>

            <div
              className={`absolute inset-0 rounded-xl ${
                imageState.sourceUrl
                  ? "group-hover:bg-black/10 transition-colors "
                  : ""
              }`}
              aria-hidden="true"
              onClick={openModal}
            />

            {!!imageState.sourceUrl && (
              <>
                <div
                  className="absolute start-2.5 top-2.5 z-20  p-1.5 pl-2 pr-2.5 bg-white text-black rounded-md cursor-pointer text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                  title={T["Edit image"]}
                  onClick={openModal}
                >
                  <PencilIcon className="w-4 h-4" />
                  {T["Edit"]}
                </div>
                <div
                  className="absolute end-1 top-1 z-20 p-1.5 bg-white text-black rounded-full cursor-pointer text-xs flex items-center gap-1"
                  title={T["Delete image"]}
                  onClick={handleFileDelete}
                >
                  <XMarkIcon className="w-4 h-4" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ModalUploadImage
        onClickApply={handleApply}
        onDelete={handleFileDelete}
        open={isOpen}
        hanldeClose={closeModal}
        isLoading={LOADING}
        defaultImage={{
          alt: imageState.altText,
          url: imageState.sourceUrl,
        }}
        enableUpload={
          NC_SITE_SETTINGS["submissions-settings"].allow_upload_media
        }
      />
    </>
  );
};

export default ButtonInsertImage;
