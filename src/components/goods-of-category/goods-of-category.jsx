import { IconSearchStroked } from '@consta/icons/IconSearchStroked'
import { Pagination } from '@consta/uikit/Pagination'
import { Select } from '@consta/uikit/Select'
import { TextField } from '@consta/uikit/TextField'
import { Theme } from '@consta/uikit/Theme'
import useMatchMedia from '@hooks/use-match-media.js'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@ui/button/index.js'

import Filters from '@components/goods-of-category/filters/index.js'
import GoodCard from '@components/other-goods-slider/good-card/good-card.jsx'

import { carPartsApi, useGetCarPartsQuery } from '../../store/modules/car-parts-api.js'
import { presetKSP } from '../../uikit/presets/presetKSP.js'
import cl from './goods-of-category.module.scss'

const GoodsOfCategory = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [search, setSearch] = useState(null)
	// const [page, setPage] = useState(1)
	const [pageData, setPageData] = useState({})
	const [carPartsPagination, setCarPartsPagination] = useState([])
	const { isMobile, isTablet, isTabletSmall, isDesktop } = useMatchMedia()
	const items = [
		{
			id: 1,
			label: 'По умолчанию',
			type: 'normal'
		},
		{
			id: 2,
			label: 'Цена по возрастанию',
			type: 'normal'
		},
		{
			id: 3,
			label: 'Цена по убыванию',
			type: 'reverse'
		}
	]
	const [selectedType, setSelectedType] = useState(items[0])
	const [minPrice, setMinPrice] = useState(0)
	const [maxPrice, setMaxPrice] = useState(200000)

	const handleApplyFilters = () => {
		// setPage(1)
	}

	const handleResetFilters = () => {
		// setPage(1)
		// setMinPrice(0)
		// setMaxPrice(1000000)
	}

	const { isLoading: isLoadingCarParts } = useGetCarPartsQuery({
		typeSort: selectedType.type,
		sort: 'price',
		limit: '12'
	})
	const [getParts, { data: Products = [] }] = carPartsApi.endpoints.getProducts.useLazyQuery()

	const loadMoreData = (page = 1, loadMore = false) => {
		// кнопка загрузить еще
		// setPage((prevPage) => prevPage + 1)
		getParts({
			typeSort: selectedType.type,
			sort: 'price',
			limit: '12',
			from: minPrice.toString(),
			to: maxPrice.toString(),
			pageNumber: page
		})
			.unwrap()
			.then((data) => {
				if (loadMore) {
					let newProducts = pageData?.data?.length ? [...pageData.data, ...data.data] : [...data.data]
					let newData = Object.assign({}, data)
					newData.data = newProducts
					setPageData(newData)
				} else {
					setPageData(data)
				}
			})
		// вернется любой ответ с сервера
	}

	useEffect(() => {
		loadMoreData()
	}, [])

	const handleChange = (search) => setSearch(search)

	// const partsList = [
	// 	{
	// 		name: 'Двигатель',
	// 		parts: ['вкладыши', 'втулки', 'гайки']
	// 	},
	// 	{
	// 		name: 'Кузов внутри',
	// 		parts: ['ложерон', 'усилитель', 'порог']
	// 	},
	// 	{
	// 		name: 'Cистема выпуска отработанных газов'
	// 	}
	// ]

	if (isOpen) {
		document.body.style.overflow = 'hidden'
	} else {
		document.body.style.overflow = ''
	}

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 992) {
				setIsOpen(false)
			}
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<>
			<div className={cn([`${cl.sidebar} ${isOpen ? '' : cl.active}`])}>
				<div className={`${isOpen ? cl.bckg : ''}`} onClick={() => setIsOpen(false)} />
				<div className={cl.group}>
					<div className={cl.sidebarContent}>
						<img
							src="../../../../../../assets/icons/closeblack.svg"
							alt=""
							className={cl.btnClose}
							onClick={() => setIsOpen(false)}
						/>
						<Filters
							minPrice={minPrice}
							maxPrice={maxPrice}
							setMinPrice={setMinPrice}
							setMaxPrice={setMaxPrice}
							onApply={handleApplyFilters}
							onReset={handleResetFilters}
						/>
					</div>
				</div>
			</div>

			<div className={cn([cl.goodsOfCategoryWrapper, 'container'])}>
				<h1 className={cl.title}>{search !== null ? `Результаты поиска "${search}"` : `Каталог`}</h1>
				<div className={cl.wrapper}>
					{(isDesktop || isTablet) && (
						<div className={cl.input}>
							{/* <InputSearchCatalog /> */}
							<TextField
								size="l"
								onChange={handleChange}
								value={search}
								type="text"
								placeholder="Поиск по наименованию, номеру запчасти или артиклю"
							/>
							<Button sizeStyle="sizeM" className={cl.button} type="button">
								Найти
							</Button>
						</div>
					)}
					{(isTabletSmall || isMobile) && (
						<div className={cl.input}>
							{/* <InputSearchCatalog /> */}
							<TextField
								leftSide={IconSearchStroked}
								size="m"
								onChange={handleChange}
								value={search}
								type="text"
								placeholder="Поиск по наименованию, номеру запчасти или артиклю"
							/>
						</div>
					)}
					<div className={cl.dropdown}>
						<Button sizeStyle="sizeS" colorStyle="outlined" className={cl.button} onClick={() => setIsOpen(true)}>
							<img src="../../../../assets/images/settings.svg" alt="" />
							Фильтр
						</Button>

						<div className={cl.select}>
							<Select
								placeholder="Выберите значение"
								view="clear"
								items={items}
								value={selectedType}
								onChange={setSelectedType}
							/>
						</div>
						{/* <DropDown /> */}
					</div>
					<div className={cl.contentWrapper}>
						<div className={cl.filter}>
							<Filters
								minPrice={minPrice}
								maxPrice={maxPrice}
								setMinPrice={setMinPrice}
								setMaxPrice={setMaxPrice}
								onApply={handleApplyFilters}
								onReset={handleResetFilters}
							/>
						</div>
						<div className={cl.cardsGroup}>
							<div className={cl.goodsWrapper}>
								{pageData?.data
									? pageData?.data.map((part) => (
									<div key={part.id}>
										<Link to={`/good/${part.id}`}>
											<GoodCard description={part.name} price={part.price} />
										</Link>
									</div>
								)) : <div>Загрузка</div>}
								{/* {carParts.map((part) => ( */}
								{/* 	<div key={part.id}> */}
								{/* 		<Link to={`/go od/${part.id}`}> */}
								{/* 			<GoodCard description={part.name} price={part.price} /> */}
								{/* 		</Link> */}
								{/* 	</div> */}
								{/* ))} */}
							</div>
							{pageData?.meta?.last_page && (
							<div className={cl.pagination}>
								{pageData.meta.current_page !== pageData.meta.last_page &&
									<Button colorStyle="outlined" className={cl.button} onClick={() => loadMoreData(pageData.meta.current_page + 1, true)}>
										Загрузить еще
									</Button>
								}
									<Theme preset={presetKSP}>
										{(isDesktop || isTablet || isTabletSmall) && (
											<Pagination
												items={pageData.meta.last_page}
												// items={priceFilter?.meta?.last_page}
												value={pageData.meta.current_page}
												onChange={(value) => loadMoreData(value)}
												visibleCount={10}
											/>
										)}
										{isMobile && (
											<Pagination
												items={pageData.meta.last_page}
												// items={priceFilter?.meta?.last_page}
												value={pageData.meta.current_page}
												onChange={(value) => loadMoreData(value)}
												visibleCount={5}
											/>
										)}
									</Theme>
							</div>
							)}
						</div>
					</div>
					{/* <div className={cl.drs}> */}
					{/* 	<div className={cl.catalogBlock}> */}
					{/* 		/!* <div className={cl.catalogBtn} onClick={() => setIsOpen(!isOpen)}> *!/ */}
					{/* 		/!* 	<Button className={cl.btn}>КАТАЛОГ ЗАПЧАСТЕЙ</Button> *!/ */}
					{/* 		/!* </div> *!/ */}
					{/* 		/!* <div className={`${cl.menu}${isOpen ? 'active' : ''}`}> *!/ */}
					{/* 		/!* 	<div className={cl.menuList}> *!/ */}
					{/* 		/!* 		<div className={cl.partsGroup}> *!/ */}
					{/* 		/!* 			{partsList.map(({ name }) => ( *!/ */}
					{/* 		/!* 				<li className={cl.partsGroupItem}>{name}</li> *!/ */}
					{/* 		/!* 			))} *!/ */}
					{/* 		/!* 		</div> *!/ */}
					{/* 		/!* 		<div className={cl.partsName}> *!/ */}
					{/* 		/!* 			{partsList.map(({ name, parts }) => ( *!/ */}
					{/* 		/!* 				<div> *!/ */}
					{/* 		/!* 					/!* <span>{name}</span> *!/ *!/ */}
					{/* 		/!* 					<li className={cl.partsNameItem}>{parts}</li> *!/ */}
					{/* 		/!* 				</div> *!/ */}
					{/* 		/!* 			))} *!/ */}
					{/* 		/!* 		</div> *!/ */}
					{/* 		/!* 	</div> *!/ */}
					{/* 		/!* 	/!* <ul className={cl.menuList}> *!/ *!/ */}
					{/* 		/!* 	/!*	{partsList.map(({ name }) => ( *!/ *!/ */}
					{/* 		/!* 	/!*		<li className={cl.menuListItem}>{name}</li> *!/ *!/ */}
					{/* 		/!* 	/!*	))} *!/ *!/ */}
					{/* 		/!* 	/!* </ul> *!/ *!/ */}
					{/* 		/!* </div> *!/ */}
					{/* 	</div> */}
					{/* 	<Filters /> */}
					{/* </div> */}
				</div>
			</div>
		</>
	)
}

export default GoodsOfCategory
