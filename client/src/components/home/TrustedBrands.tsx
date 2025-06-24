import React from "react";

export default function TrustedBrands() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-8">Trusted by organizations worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
            <div className="flex justify-center items-center">
              <div className="bg-gray-200 rounded-lg p-4 w-24 h-12"></div>
            </div>
            <div className="flex justify-center items-center">
              <div className="bg-gray-200 rounded-lg p-4 w-24 h-12"></div>
            </div>
            <div className="flex justify-center items-center">
              <div className="bg-gray-200 rounded-lg p-4 w-24 h-12"></div>
            </div>
            <div className="flex justify-center items-center">
              <div className="bg-gray-200 rounded-lg p-4 w-24 h-12"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}