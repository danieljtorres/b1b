<template>
	<div>
		<md-table v-model="searched" md-sort="email" md-sort-order="asc" md-card md-fixed-header>
			<md-table-toolbar>
				<div class="md-toolbar-section-start">
					<h1 class="md-title">Clientes</h1>
				</div>

				<md-field class="md-toolbar-section-end">
					<md-select v-model="limit" name="limit" id="limit">
						<md-option value="1">1</md-option>
						<md-option value="5">5</md-option>
						<md-option value="10">10</md-option>
						<md-option value="25">25</md-option>
						<md-option value="50">50</md-option>
						<md-option :value="totalRows">Todos</md-option>
					</md-select>
				</md-field>
				<md-field md-clearable class="md-toolbar-section-end">
					<md-input placeholder="Buscar..." v-model="search" @input="searchOnTable" />
				</md-field>
			</md-table-toolbar>

			<md-table-empty-state md-label="No users found" :md-description="`No user found for this '${search}' query. Try a different search term or create a new user.`">
				<md-button class="md-primary md-raised" @click="newUser">Nuevo cliente</md-button>
			</md-table-empty-state>

			<md-table-row slot="md-table-row" slot-scope="{ item }">
				<md-table-cell md-label="Usuario" md-sort-by="usuario">
					{{ item.usuario }}
				</md-table-cell>
				<md-table-cell md-label="Email" md-sort-by="email">
					{{ item.email }}
				</md-table-cell>
				<md-table-cell md-label="Nombres" md-sort-by="_cliente.nombres">
					{{ item._cliente.nombres }}
				</md-table-cell>
				<md-table-cell md-label="Apellidos" md-sort-by="_cliente.apellidos">	
					{{ item._cliente.apellidos }}
				</md-table-cell>
				<md-table-cell md-label="DNI" md-sort-by="_cliente.identificacion">	
					{{ item._cliente.identificacion || 'N/A' }}
				</md-table-cell>
				<md-table-cell md-label="Pais" md-sort-by="_cliente._pais.nombre">	
					{{ item._cliente._pais.nombre || 'N/A' }}
				</md-table-cell>
			</md-table-row>
		</md-table>
		<dm-paginator v-bind:total="totalRows" v-bind:limit="limit" @pageChanged="inPage($event)">
		</dm-paginator>
	</div>
</template>

<script>
	import axios from "axios";
	import VueJWT from 'vuejs-jwt';
	import UserService from "@/_services/User.service";

	const toLower = text => {
		return text.toString().toLowerCase()
	}

	const searchByName = (items, term) => {
		if (term) {
			return items.filter(item => toLower(item.email).includes(toLower(term)))
		}
		return items
	}

	export default {
		data: () => ({
			search: null,
			searched: [],
			users: [],
			totalRows: 0,
			limit: 5
		}),
		created() {
			this.getClientList(this.limit, 0);
		},
		watch: {
			limit: function(o,n) {
				this.getClientList(o, 0);
			}
		},
		methods: {
			getClientList(limit, offset) {
				UserService.getClients(limit, offset).then(response => {
					this.users = response.data.data;
					this.searched = this.users;
					this.totalRows = response.headers["total-rows"];
				}, err => {
					console.log(err);
				});
			},
			newUser() {
				window.alert('Noop')
			},
			searchOnTable() {
				this.searched = searchByName(this.users, this.search)
			},
			inPage($event) {
				this.getClientList(this.limit, $event);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.md-field {
		max-width: 300px;
	}
</style>