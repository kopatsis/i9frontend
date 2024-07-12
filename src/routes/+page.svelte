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
			pullDownDistance = Math.min(pullDownDistance, 200);
			innerContent.style.transform = `translateY(${pullDownDistance}px)`;
			
		}
		if(currentY !== startY) {
			event.preventDefault();
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
			}, 300);
		}
	}

	async function mountCall() {
		loading = true;
		willReload = false;
		const token = await getLoginToken();
		await Promise.all([getUser(token, true), getLastWO(token)]);
		uname = userObj && userObj.Name ? userObj.Name : '';
		workoutTypeSession();
		nameSession();
		ratingSession();
		loading = false;
	}

	onMount(() => {
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
	<Rate />
{:else if createPop}
	<CreateFormPop />
{:else if showForm}
	<UserUpdateForm bind:exists={showForm} />
{/if}

<div class="centerpage">
	<div class="wholepage">
		<div class="header">
			<MainHeader />
		</div>

		<div class="headerstupid">
			{#if loading}
				<div>loading...</div>
			{:else if error}
				<div>F: {error}</div>
			{:else}
				{#if willReload}
					<div class="willReload">Will reload...</div>
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

					<div>
						{#if userObj && userObj.ID}
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
							<br />
						{/if}
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
	.centerpage {
		display: flex;
		align-items: center;
		justify-content: center;
		display: flex;
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
		background-color: white;
	}

	.recentb {
		display: flex;
		justify-content: center;
	}

	.maingen {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5;
		margin-top: 0px;
		padding-top: 20px;
		background: linear-gradient(to top, white 77.5%, transparent);
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
		color: inherit;
		background-color: transparent;
		font-weight: normal;
		z-index: 6;
		background: white;
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
		color: inherit;
		background-color: transparent;
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
		color: inherit;
		background-color: transparent;
		font-weight: normal;
		margin-bottom: 30px;
	}

	.headerstupid {
		margin-top: 5px;
		margin-bottom: 5px;
		margin-left: 5px;
		margin-right: 5px;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		scrollbar-width: none;
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
		margin-top: 10px;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
