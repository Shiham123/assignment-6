const btnContainerEl = document.getElementById('btn-container');
const cardContainerEl = document.getElementById('card-container');
const sortBtnEl = document.getElementById('sort-button');
const sortResponsiveBtnEl = document.getElementById('sort-responsive');

let categoryString = '' || '1000';

const getSortId = (data) => {
  categoryString = data;
};

// get data from api
const getApiBtn = async () => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/videos/categories`
  );
  const data = await response.json();
  showBtn(data);
};

// show button section
const showBtn = (data) => {
  let showItem = data.data;

  showItem.forEach((item) => {
    const { category, category_id } = item;

    const createBtn = document.createElement('button');
    createBtn.classList.add(
      'btn',
      'btn-xs',
      'sm:btn-sm',
      'md:btn-md',
      'lg:btn-lg',
      'text-[18px]',
      'font-normal',
      'hover:bg-[#FF1F3D]',
      'hover:text-[#ffffff]',
      'lg:mx-4',
      'md:mx-4',
      'md:my-4',
      'm-2'
    );
    createBtn.textContent = category;
    createBtn.onclick = () => {
      cardContainerEl.innerHTML = '';
      getApiByCategory(category_id);
      getSortId(category_id);
    };
    btnContainerEl.appendChild(createBtn);
  });
};

// get api to showing the card dynamically
const getApiByCategory = async (id) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${id}`
  );
  const data = await response.json();
  showCard(data.data);
};

// showing card section
const showCard = (cards) => {
  let showCards = cards;
  if (showCards.length === 0) {
    cardContainerEl.innerHTML = `
    <div class="flex flex-col justify-center items-center md:col-span-2">
      <img src="./Design in png/Icon.png" alt="" class="w-[200px]"/>
      <p class="font text-center text-[32px] font-bold leading-[44px]">Oops!! Sorry, There is no <br /> content here</p>
    </div>
    `;
    return;
  }

  showCards.forEach((card) => {
    const { authors, title, thumbnail, others } = card;
    let postedTime = others.posted_date;

    const covertPostedDate = (postedTime) => {
      const secMin = 60;
      const secHour = secMin * 60;
      const secDay = secHour * 24;
      const secYear = secDay * 365.25;

      const yearsValue = Math.floor(postedTime / secYear);
      postedTime %= secYear;

      const daysValue = Math.floor(postedTime / secDay);
      postedTime %= secDay;

      const hoursValue = Math.floor(postedTime / secHour);
      postedTime %= secHour;

      const minutesValue = Math.floor(postedTime / secMin);
      postedTime %= secMin;

      const result = {
        yearObject: yearsValue > 0 ? yearsValue : null,
        daysObject: daysValue > 0 ? daysValue : null,
        hoursObject: hoursValue >= 0 ? hoursValue : null,
        minutesObject: minutesValue >= 0 ? minutesValue : null,
      };

      return result;
    };

    const convertedValue = covertPostedDate(postedTime);
    const { yearObject, daysObject, hoursObject, minutesObject } =
      convertedValue;

    const createCardDiv = document.createElement('div');
    createCardDiv.innerHTML = `
    <div class="card w-96 bg-base-100 overflow-hidden">
      <figure class="w-11/12 h-[200px] relative z-0">
        <img class="object-contain" src="${thumbnail}" alt="Shoes" />
        ${
          yearObject || daysObject || hoursObject || minutesObject
            ? `<div class="absolute bottom-5 right-7 bg-[#171717] p-2 rounded-lg">
                <p class="font text-[#ffffff] text-[10px] font-medium">${
                  yearObject ? yearObject + ' years ' : ''
                }${
                daysObject ? daysObject + ' days ' : ''
              }${hoursObject}hrs ${minutesObject} min ago</p>
              </div>`
            : ''
        }
      </figure>
      <div class="card-body grid grid-cols-5">
        <div class="card-left col-start-1 col-span-1">
          <img src="${
            authors[0].profile_picture
          }" class="rounded-full h-10 w-10" alt="" />
        </div>
        <div class="card-right col-start-2 col-span-4">
          <h2 class="card-title text-[16px] font-bold leading-[26px] text-[#171717]">
            ${title}
          </h2>
          <div class="flex">
            <p class="text-[#171717b3] text-[14px] font-normal">
              ${authors[0].profile_name}
              <span>
                <div>
                  ${
                    authors[0].verified
                      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_13_960)"><path d="M19.375 10.0001C19.375 10.8001 18.3922 11.4595 18.1953 12.197C17.9922 12.9595 18.5063 14.022 18.1203 14.6892C17.7281 15.3673 16.5484 15.4486 15.9984 15.9986C15.4484 16.5486 15.3672 17.7282 14.6891 18.1204C14.0219 18.5064 12.9594 17.9923 12.1969 18.1954C11.4594 18.3923 10.8 19.3751 10 19.3751C9.2 19.3751 8.54062 18.3923 7.80312 18.1954C7.04062 17.9923 5.97813 18.5064 5.31094 18.1204C4.63281 17.7282 4.55156 16.5486 4.00156 15.9986C3.45156 15.4486 2.27187 15.3673 1.87969 14.6892C1.49375 14.022 2.00781 12.9595 1.80469 12.197C1.60781 11.4595 0.625 10.8001 0.625 10.0001C0.625 9.20012 1.60781 8.54075 1.80469 7.80325C2.00781 7.04075 1.49375 5.97825 1.87969 5.31106C2.27187 4.63293 3.45156 4.55168 4.00156 4.00168C4.55156 3.45168 4.63281 2.272 5.31094 1.87981C5.97813 1.49387 7.04062 2.00793 7.80312 1.80481C8.54062 1.60793 9.2 0.625122 10 0.625122C10.8 0.625122 11.4594 1.60793 12.1969 1.80481C12.9594 2.00793 14.0219 1.49387 14.6891 1.87981C15.3672 2.272 15.4484 3.45168 15.9984 4.00168C16.5484 4.55168 17.7281 4.63293 18.1203 5.31106C18.5063 5.97825 17.9922 7.04075 18.1953 7.80325C18.3922 8.54075 19.375 9.20012 19.375 10.0001Z" fill="#2568EF"/><path d="M12.7094 7.20637L9.14065 10.7751L7.29065 8.92669C6.88909 8.52512 6.23752 8.52512 5.83596 8.92669C5.4344 9.32825 5.4344 9.97981 5.83596 10.3814L8.43127 12.9767C8.82190 13.3673 9.45627 13.3673 9.84690 12.9767L14.1625 8.66106C14.5641 8.2595 14.5641 7.60794 14.1625 7.20637C13.7610 6.80481 13.1110 6.80481 12.7094 7.20637Z" fill="#FFFCEE"/></g><defs><clipPath id="clip0_13_960"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>'
                      : ''
                  }
                </div>
              </span>
            </p>
          </div>
          <p class="text-[#171717b3] text-[14px] font-normal leading-normal">
            ${others.views} Views
          </p>
        </div>
      </div>
    </div>
  `;
    cardContainerEl.appendChild(createCardDiv);
  });
};

// sorting section
const getSortApi = async (categoryId) => {
  const response = await fetch(
    `https://openapi.programming-hero.com/api/videos/category/${categoryId}`
  );
  const data = await response.json();
  let sortData = data.data;

  const sortDataConvert = (viewCount) => {
    if (viewCount.endsWith('K')) {
      return parseFloat(viewCount) * 1000;
    }
  };

  sortData.sort((firstElement, secondElement) => {
    const sortA = sortDataConvert(firstElement.others.views);
    const sortB = sortDataConvert(secondElement.others.views);
    return sortB - sortA;
  });
  return sortData;
};

const showSortingArray = async (id) => {
  const sortingArr = await getSortApi(id);
  cardContainerEl.innerHTML = '';
  showCard(sortingArr);
};

sortBtnEl.addEventListener('click', () => {
  showSortingArray(categoryString);
});

sortResponsiveBtnEl.addEventListener('click', () => {
  showSortingArray(categoryString);
});

getApiByCategory('1000');
getApiBtn();
