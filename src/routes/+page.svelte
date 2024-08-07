<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { getLoginToken, setLocalLoginState } from '$lib/jshelp/localtoken';
	import { onDestroy, onMount } from 'svelte';
	import { afterWOMessage, nameSession, workoutTypeSession } from '$lib/stores/workout';
	import { getUser, user, getLastWO, lastWO } from '$lib/stores/user';
	import UserUpdateForm from '../popups/UserUpdateForm.svelte';
	import {
		adaptID,
		creationType,
		isCreateForm,
		isRating,
		ratingSession
	} from '$lib/stores/creation';
	import { localLogin, userStore } from '$lib/jshelp/firebaseuser';
	import MainFooter from '../components/MainFooter.svelte';
	import MainHeader from '../components/MainHeader.svelte';
	import Rate from '../popups/Rate.svelte';
	import CreateFormPop from '../popups/CreateFormPop.svelte';
	import { unravelWO, unravelstretchWO } from '$lib/jshelp/unravelwo';
	import { preloadImages } from '$lib/jshelp/preloader';
	import {
		extractImageList,
		getStretchWorkoutById,
		getWorkoutById,
		restartIntroWorkoutByID,
		restartStretchWorkoutByID,
		restartWorkoutByID
	} from '$lib/jshelp/fetchwo';
	import { settingsChecker } from '$lib/jshelp/colors';

	let local = false;
	let firebaseUser = undefined;
	let loading = true;
	let willReload = false;

	let uname = '';
	let showForm = false;
	let error = '';

	let greeting = 'Welcome';

	let innerContent;
	let startY = 0;
	let currentY = 0;
	let pullDownDistance = 0;
	let pulling = false;

	let afterWOMTrue = false;
	const unsubscribe = afterWOMessage.subscribe((afterWOMessage) => {
		afterWOMTrue = afterWOMessage;
	});

	let userObj;
	const unsubscribeUser = user.subscribe((user) => {
		userObj = user;
	});

	let recentWO;
	const unsubWO = lastWO.subscribe((wo) => {
		recentWO = wo;
	});

	let ratingPop = false;
	const unsubscribeRating = isRating.subscribe((rating) => {
		ratingPop = rating;
	});

	let createPop = false;
	const unsubscribeCreate = isCreateForm.subscribe((create) => {
		createPop = create;
	});

	function getRandomGreeting() {
		const greetings = ['Welcome', 'Hello', 'Hey', 'Howdy', 'Hi', 'Heyy', 'Heyyy'];
		const random = Math.random();
		return random < 0.5
			? greetings[0]
			: greetings[Math.floor(Math.random() * (greetings.length - 1)) + 1];
	}
	greeting = getRandomGreeting();

	function workoutGen() {
		if (userObj && userObj.Assessed) {
			creationType.set('Regular');
		} else {
			creationType.set('Intro');
		}
		isCreateForm.set(true);
	}

	function formatDateString(isoDateString) {
		const date = new Date(isoDateString);
		return date.toLocaleString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});
	}

	async function toReview() {
		loading = true;
		try {
			const token = await getLoginToken();
			const workout = await getWorkoutById(token, recentWO.id);
			if (recentWO.type === 'Intro') {
				unravelWO(workout, 'Intro');
			} else {
				unravelWO(workout);
			}

			preloadImages(extractImageList(workout));
			loading = false;
			sessionStorage.removeItem('reqType');
			sessionStorage.removeItem('reqBody');
			goto('./review');
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	}

	async function toRestart() {
		loading = true;
		try {
			const token = await getLoginToken();
			let workout;
			if (recentWO.type === 'Intro') {
				workout = await restartIntroWorkoutByID(token, recentWO.id);
				unravelWO(workout, 'Intro');
			} else {
				workout = await restartWorkoutByID(token, recentWO.id);
				unravelWO(workout);
			}

			preloadImages(extractImageList(workout));
			loading = false;
			sessionStorage.removeItem('reqType');
			sessionStorage.removeItem('reqBody');
			goto('./review');
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	}

	async function toReviewSt() {
		loading = true;
		try {
			const token = await getLoginToken();
			const workout = await getStretchWorkoutById(token, recentWO.id);
			unravelstretchWO(workout);
			preloadImages(extractImageList(workout));
			loading = false;
			sessionStorage.removeItem('reqType');
			sessionStorage.removeItem('reqBody');
			goto('./review');
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	}

	async function toRestartSt() {
		loading = true;
		try {
			const token = await getLoginToken();
			const workout = await restartStretchWorkoutByID(token, recentWO.id);
			unravelstretchWO(workout);
			preloadImages(extractImageList(workout));
			loading = false;
			sessionStorage.removeItem('reqType');
			sessionStorage.removeItem('reqBody');
			goto('./review');
		} catch (err) {
			loading = false;
			error = err;
			console.log(err);
		}
	}

	function handleTouchStart(event) {
		if (event.touches.length !== 1 || innerContent.scrollTop > 0) return;
		startY = event.touches[0].pageY;
		pulling = true;
	}

	function handleTouchMove(event) {
		if (!pulling) return;

		currentY = event.touches[0].pageY;
		pullDownDistance = currentY - startY;

		if (pullDownDistance > 0) {
			pullDownDistance = Math.min(pullDownDistance, 75);
			innerContent.style.transform = `translateY(${pullDownDistance}px)`;
			event.preventDefault();
		}

		if (pullDownDistance > 35) {
			willReload = true;
		} else {
			willReload = false;
		}
	}

	function handleTouchEnd() {
		if (pullDownDistance > 0) {
			innerContent.style.transition = 'transform 0.3s ease';
			innerContent.style.transform = 'translateY(0px)';

			setTimeout(() => {
				innerContent.style.transition = '';
				pulling = false;
				pullDownDistance = 0;
				if (willReload) {
					reload();
				}
			}, 300);
		}
	}

	function reload() {
		loading = true;
		willReload = false;
		mountCall();
	}

	async function mountCall() {
		const token = await getLoginToken();
		await Promise.all([getUser(token, true), getLastWO(token)]);
		uname = userObj && userObj.Name ? userObj.Name : '';
		workoutTypeSession();
		nameSession();
		ratingSession();
		loading = false;
	}

	onMount(() => {
		settingsChecker();
		setLocalLoginState();

		const unsubLocalLogin = localLogin.subscribe((value) => {
			console.log('local sub run: ', value);
			local = value;
			if (local && !firebaseUser) {
				console.log('trigger?');
				mountCall();
			}
		});

		const unsubFirebase = userStore.subscribe((value) => {
			console.log('firebase sub run: ', value, localLogin);
			firebaseUser = value;
			if (firebaseUser === undefined && !local) {
				loading = true;
			} else if (firebaseUser === null && !local) {
				goto('./login');
			} else if (firebaseUser) {
				mountCall();
			}
		});

		return () => {
			unsubLocalLogin();
			unsubFirebase();
		};
	});

	onDestroy(() => {
		afterWOMessage.set(false);
		unsubscribeUser();
		unsubscribe();
		unsubWO();
		unsubscribeRating();
		unsubscribeCreate();
	});
</script>

{#if ratingPop}
	<Rate bind:loading />
{:else if createPop}
	<CreateFormPop bind:loading />
{:else if showForm}
	<UserUpdateForm bind:exists={showForm} bind:loading />
{/if}

<div class="centerpage">
	<div class="wholepage">
		{#if loading}
			<div class="loading">
				<div class="bouncer">
					<img src="/images/i9logotsp.png" alt="sdafa" />
				</div>
				<div class="loader2"></div>
			</div>
		{/if}

		<div class="header">
			<MainHeader />
		</div>

		<div class="headerstupid">
			{#if error}
				<div>F: {error}</div>
			{:else}
				{#if willReload}
					<div class="willReload"><div class="loader2"></div></div>
				{/if}
				<div
					class="innercontent"
					bind:this={innerContent}
					on:touchstart={handleTouchStart}
					on:touchmove={handleTouchMove}
					on:touchend={handleTouchEnd}
				>
					{#if afterWOMTrue}
						<div class="greeting">
							Nice job{#if !uname || uname === 'local'}!{:else}, {uname}!{/if}
						</div>
					{:else}
						<div class="greeting">
							<div>
								{greeting}{#if !uname || uname === 'local'}!{:else},{/if}
							</div>
							{#if uname && uname !== 'local'}
								<div>
									{uname}
								</div>
							{/if}
						</div>
					{/if}

					<div>
						<div>
							<button class="edit" on:click={() => (showForm = true)}>Edit Workout Defaults</button>
						</div>
					</div>

					<div class="mainpage">
						{#if userObj && userObj.ID}
							<div>
								<div>Quick User Information:</div>
								{#if userObj.DisplayLevel}
									<div>Progress Level: {userObj.DisplayLevel}</div>
								{/if}
								{#if userObj.WOGeneratedCt}
									<div>Workouts Generated: {userObj.WOGeneratedCt}</div>
								{/if}
								{#if userObj.StrWOGeneratedCt}
									<div>Stretch Workouts Generated: {userObj.StrWOGeneratedCt}</div>
								{/if}
								{#if userObj.WOStartedCt}
									<div>Workouts Started: {userObj.WOStartedCt}</div>
								{/if}
								{#if userObj.StrWOStartedCt}
									<div>Stretch Workouts Started: {userObj.StrWOStartedCt}</div>
								{/if}
								{#if userObj.Badges && userObj.Badges.length > 0}
									<div>Achievements:</div>
									<ul>
										{#each userObj.Badges as badge}
											<li>{badge}</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/if}

						<div>
							{#if recentWO}
								<div>Your most recent workout details:</div>
								<div>Name: {recentWO.name}</div>
								<div>Type: {recentWO.type} workout</div>
								<div>Date: {formatDateString(recentWO.date)}</div>
								<div>Status: {recentWO.status}</div>
								{#if recentWO.stored === true}
									<div class="recentb">
										<button class="recentbutton" on:click={() => goto('./review')}>Resume</button>
									</div>
								{:else if recentWO.type === 'Stretch'}
									<div class="recentb">
										{#if recentWO.status === 'Unstarted' || recentWO.status === 'Not Started'}
											<button class="recentbutton" on:click={toReviewSt}>Start</button>
										{:else if recentWO.status === 'Progressing' || recentWO.status === 'Paused'}
											<button class="recentbutton" on:click={toReviewSt}>Resume</button>
											<button class="recentbutton" on:click={toRestartSt}>Restart</button>
										{:else}
											<button class="recentbutton" on:click={toRestartSt}>Restart</button>
										{/if}
									</div>
								{:else}
									<div class="recentb">
										{#if recentWO.status === 'Unstarted' || recentWO.status === 'Not Started'}
											<button class="recentbutton" on:click={toReview}>Start</button>
										{:else if recentWO.status === 'Progressing' || recentWO.status === 'Paused'}
											<button class="recentbutton" on:click={toReview}>Resume</button>
											<button class="recentbutton" on:click={toRestart}>Restart</button>
										{:else if recentWO.type !== 'Intro'}
											<button class="recentbutton" on:click={toRestart}>Restart</button>
											<!-- <button class="recentbutton" on:click={toAdapt}>Adapt*</button>
										<div>
											*Adapt means the times and exercises/stretches will be the same, but the reps
											will be re-calculated to your current level.
										</div> -->
										{/if}
									</div>
								{/if}
							{:else}
								<div>Your most recent workout details:</div>
								<div>No workouts generated (yet)</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="maingen">
					<button class="gen" on:click={workoutGen}>Generate Workout</button>
				</div>
			{/if}
		</div>
		<div class="footer">
			<MainFooter />
		</div>
	</div>
</div>

<style>
	.bouncer {
		padding: 10px;
		padding-top: 20px;
	}

	.bouncer img {
		height: auto;
		width: clamp(100px, 50dvw, 300px);
		animation: bounce 0.6s infinite;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(218, 229, 225, 0.85);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2000;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-25px);
			animation-timing-function: cubic-bezier(0.62, 0.1, 0.62, 1.21);
		}
	}

	.loader2 {
		width: 50px;
		aspect-ratio: 1;
		display: grid;
		border-radius: 50%;
		background:
			linear-gradient(0deg, rgb(0 0 0/50%) 30%, #0000 0 70%, rgb(0 0 0/100%) 0) 50%/8% 100%,
			linear-gradient(90deg, rgb(0 0 0/25%) 30%, #0000 0 70%, rgb(0 0 0/75%) 0) 50%/100% 8%;
		background-repeat: no-repeat;
		animation: l23 0.6s infinite steps(12);
	}
	.loader2::before,
	.loader2::after {
		content: '';
		grid-area: 1/1;
		border-radius: 50%;
		background: inherit;
		opacity: 0.915;
		transform: rotate(30deg);
	}
	.loader2::after {
		opacity: 0.83;
		transform: rotate(60deg);
	}
	@keyframes l23 {
		100% {
			transform: rotate(1turn);
		}
	}

	.centerpage {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		background-color: rgb(97, 97, 97);
		width: 100dvw;
		height: 100dvh;
	}

	.wholepage {
		height: 100dvh;
		width: min(100dvw, 960px);
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		position: fixed;
		background: rgba(236, 241, 243, 0.85);
		box-shadow:
			rgba(0, 0, 0, 0.25) 0px 54px 55px,
			rgba(0, 0, 0, 0.12) 0px -12px 30px,
			rgba(0, 0, 0, 0.12) 0px 4px 6px,
			rgba(0, 0, 0, 0.17) 0px 12px 13px,
			rgba(0, 0, 0, 0.09) 0px -3px 5px;
	}

	@media (max-width: 960px) {
		.wholepage {
			background: rgba(236, 241, 243, 0.8);
		}
	}

	.centerpage::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgb(36, 4, 48) 0%,
			rgba(0, 0, 0, 1) 50%,
			rgb(1, 26, 24) 100%
		);
		z-index: -2;
	}

	.centerpage::after {
		content: '';
		position: absolute;
		top: -300%;
		left: -300%;
		width: 600%;
		height: 600%;
		background-image: url('/images/bgminitr2.png');
		background-repeat: repeat;
		background-size: 121px 51px;
		transform: rotate(45deg);
		transform-origin: center;
		z-index: -1;
	}

	.recentb {
		display: flex;
		justify-content: center;
	}

	.maingen {
		width: calc(100% + 10px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
		margin: -5px;
		padding-top: 30px;
		padding-bottom: 5px;
		background: linear-gradient(to top, rgba(236, 241, 243, 0.85) 77.5%, transparent);
	}

	@media (max-width: 960px) {
		.maingen {
			background: linear-gradient(to top, rgba(236, 241, 243, 0.85) 77.5%, transparent);
		}
	}

	.gen {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 28px;
		margin: 10px;
		margin-top: 00px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		background-color: var(--main-color);
		color: white;
		font-weight: normal;
		z-index: 6;
	}

	.recentbutton {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 16px;
		margin: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		background-color: var(--main-color);
		color: white;
		font-weight: normal;
	}

	.edit {
		border-radius: 0px;
		transition: border-color 150ms ease-in-out 0s;
		outline: none;
		font-size: 18px;
		margin: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
		padding-left: 12px;
		padding-right: 12px;
		border: 1px solid rgb(137, 151, 155);
		background-color: var(--main-color);
		color: white;
		font-weight: normal;
		margin-bottom: 30px;
	}

	.headerstupid {
		padding: 5px;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		scrollbar-width: none;
		position: relative;
	}

	.greeting {
		font-size: 48px;
		font-weight: lighter;
		text-align: center;
		margin-top: 24px;
		margin-bottom: 24px;
	}

	.header,
	.footer {
		width: 100%;
	}

	.innercontent {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		width: 100%;
		align-items: center;
		margin-bottom: -20px;
		padding-bottom: 25px;
	}

	.willReload {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
	}

	.mainpage {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.mainpage > div {
		margin: 15px;
	}

	@media (min-width: 725px) {
		.mainpage {
			flex-direction: row;
		}
	}
</style>
