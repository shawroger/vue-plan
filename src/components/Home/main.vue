<template>
	<div id="home-main">
		<mu-container>
			<mu-row gutter justify-content="center">
				<mu-col span="10" sm="10" lg="6">
					<mu-card
						><mu-tabs
							:value.sync="currentTab"
							inverse
							full-width
							color="orange"
							text-color="rgba(0, 0, 0, 0.54)"
							center
						>
							<mu-tab>查看项目</mu-tab>
							<mu-tab>添加项目</mu-tab>
						</mu-tabs>
						<div class="data-list" v-if="currentTab === 0">
							<mu-data-table stripe :data="sortedColl" :columns="columns">
								<template slot="expand" slot-scope="prop">
									<div class="item-content">
										<div class="content-render">{{ prop.row.content }}</div>
										<div class="btn-list-inline">
											<mu-button
												color="primary"
												@click="deleteItem(prop['$index'])"
												>删除</mu-button
											>
											<mu-button
												color="primary"
												@click="doneItem(prop['$index'])"
												:disabled="
													prop.row.done ||
														(!prop.row.done && checkDate(prop.row.date) < 0)
												"
												>完成</mu-button
											>
										</div>
									</div>
								</template>
								<template slot-scope="scope">
									<td>{{ scope.row.title }}</td>
									<td>
										{{
											scope.row.done
												? "已完成"
												: checkDate(scope.row.date) > 0
												? checkDate(scope.row.date) + "天后截止"
												: checkDate(scope.row.date) == 0
												? "当天截止"
												: "已失效"
										}}
									</td>
									<td>
										{{ scope.row.done ? "✔" : setStatus(scope.row.date) }}
									</td>
								</template>
							</mu-data-table>
						</div>
						<div class="add-items-card" v-if="currentTab === 1">
							<mu-form :model="form">
								<mu-form-item label="标题">
									<mu-text-field
										v-model="form.title"
									></mu-text-field> </mu-form-item
								><mu-form-item label="日期">
									<mu-date-input
										v-model="form.date"
									></mu-date-input> </mu-form-item
								><mu-form-item label="项目内容">
									<mu-text-field
										multi-line
										:rows="6"
										v-model="form.content"
									></mu-text-field> </mu-form-item
							></mu-form>
							<div class="btn-list">
								<mu-button color="primary" @click="clearItem">重置</mu-button>
								<mu-button color="primary" @click="addItem">添加</mu-button>
							</div>
						</div>

						<mu-card-actions v-if="currentTab === 0">
							<mu-button flat @click="downloadFile">导出</mu-button>
							<mu-button flat @click="uploadFile">导入</mu-button>
						</mu-card-actions>
					</mu-card>
				</mu-col></mu-row
			>
		</mu-container>
	</div>
</template>

<script lang="ts">
import {
	createComponent,
	ref,
	reactive,
	watch,
	computed,
	onBeforeUnmount
} from "@vue/composition-api";
import { genFile, Upload } from "@/services/filexon";
export default createComponent({
	name: "home-main",
	setup(props, ctx) {
		const currentTab = ref(0);
		const form = reactive({
			date: "",
			title: "",
			content: ""
		});

		const collections = ref(
			window.localStorage.getItem("plan-store")
				? JSON.parse(window.localStorage.getItem("plan-store") as string)
				: ([] as any[])
		);

		const columns = [
			{ title: "项目名称", align: "center", name: "title" },
			{ title: "截止日期", align: "center", name: "date" },
			{ title: "状态", align: "center", name: "status" }
		];

		const sortedColl = computed(() =>
			collections.value.sort(
				(a: any, b: any) => checkDate(a.date) - checkDate(b.date)
			)
		);

		function clearItem() {
			form.date = form.title = form.content = "";
		}

		function addItem() {
			if (form.title === "" || form.date === "" || form.content === "") {
				ctx.root.$alert("还有未填写的内容😧", "提示", {
					okLabel: "返回"
				});

				return;
			}

			if (checkDate(form.date as any) < 0) {
				ctx.root.$alert("不能选择过去的日期作为截止日期😨", "提示", {
					okLabel: "返回"
				});

				return;
			}
			const item = {
				title: form.title,
				date: form.date,
				content: form.content,
				done: false
			};
			collections.value.push(item);
			clearItem();
			ctx.root.$alert("项目添加完成😘", "消息", {
				okLabel: "知道了"
			});
		}

		function checkDate(date: Date | string): number {
			const today = Date.parse(new Date().toDateString());
			const thatDay = Date.parse(
				typeof date === "string"
					? new Date(date).toDateString()
					: date.toDateString()
			);
			return Math.floor((thatDay - today) / 1000 / 3600 / 24);
		}

		function setStatus(date: Date): string {
			const diff = checkDate(date);
			if (diff < 0) {
				return "❌";
			} else if (diff === 0) {
				return "❗";
			} else if (0 < diff && diff <= 3) {
				return "🔥";
			} else if (3 < diff && diff <= 7) {
				return "🍁";
			} else if (7 < diff && diff <= 14) {
				return "🍀";
			} else {
				return "🌳";
			}
		}

		function deleteItem(index: number) {
			collections.value.splice(index, 1);
		}

		function doneItem(index: number) {
			collections.value[index]["done"] = true;
			window.localStorage.setItem(
				"plan-store",
				JSON.stringify(sortedColl.value)
			);
		}

		function downloadFile() {
			genFile(JSON.stringify(sortedColl.value));
		}

		function uploadFile() {
			const upload = new Upload();
			upload.setCallback(() => {
				collections.value = JSON.parse(upload.content);
			});

			upload.safeTrigger();
		}

		const watchStorage = watch([() => collections.value], () => {
			window.localStorage.setItem(
				"plan-store",
				JSON.stringify(sortedColl.value)
			);
		});

		onBeforeUnmount(() => {
			watchStorage();
			window.localStorage.setItem(
				"plan-store",
				JSON.stringify(sortedColl.value)
			);
		});
		return {
			addItem,

			columns,
			clearItem,
			currentTab,
			collections,
			deleteItem,
			doneItem,
			form,
			checkDate,
			setStatus,
			sortedColl,
			downloadFile,
			uploadFile
		};
	}
});
</script>

<style lang="less" scoped>
#home-main {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 50px;

	.mu-card {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.data-list {
			width: 100%;
			min-height: 300px;
			.item-content {
				.content-render {
					font-size: 14px;
					padding: 20px;
					color: @textColor;
					margin-bottom: 25px;
				}
				.btn-list-inline {
					width: 100%;
					display: flex;
					justify-content: space-around;
					padding: 20px 0px;
				}
			}
			td {
				color: @textColor;
				text-align: center;
			}
		}
		.add-items-card {
			width: 80%;
			margin-top: 40px;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.btn-list {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding-bottom: 35px;
		}

		.mu-card-actions {
			color: @textColor;
			margin-top: 25px;
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>
