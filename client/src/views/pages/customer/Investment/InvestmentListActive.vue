<template>
	<div>
		<md-table v-model="searched" md-sort="email" md-sort-order="asc" md-card md-fixed-header>
			<md-table-toolbar>
				<div class="md-toolbar-section-start">
					<h1 class="md-title">Inversiones</h1>
				</div>

				<md-field class="md-toolbar-section-end" style="max-width: 80px;margin-right: 12px;">
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
				<md-table-cell md-label="Fecha de aprobacion" md-sort-by="aprobado">
					{{ item.aprobado }}
				</md-table-cell>
				<md-table-cell md-label="Monto" md-sort-by="monto">
					{{ item.monto }}
				</md-table-cell>
				<md-table-cell md-label="Por cobrar" md-sort-by="_por_cobrar">
					{{ item._por_cobrar }}
				</md-table-cell>
				<md-table-cell md-label="Voucher">
					<a :href="item.voucher" target="_blank">Ver Voucher</a>
				</md-table-cell>
                <md-table-cell md-label="Plan" md-sort-by="_plan.titulo">
					{{ item._plan.titulo }}
				</md-table-cell>
				<md-table-cell md-label="Acciones">
					<md-menu md-direction="bottom-end">
						<md-button class="md-icon-button" md-menu-trigger>
							<md-icon>menu</md-icon>
						</md-button>
					
						<md-menu-content>
							<md-menu-item v-if="item._por_cobrar > 0">
								<span>Cobrar</span>
								<md-icon>done</md-icon>
							</md-menu-item>
					
							<md-menu-item :to="{ name: 'CustomerInvestmentRecord', params: {id:item.id } }" >
								<span>Historial</span>
								
								<md-icon>view_list</md-icon>
							</md-menu-item>
						</md-menu-content>
					</md-menu>
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
    import InvestmentService from '@/_services/Investment.service.js';

	const toLower = text => {
		return text.toString().toLowerCase()
	}

	const searchByName = (items, term) => {
		if (term) {
			return items.filter(item => toLower(item.monto).includes(toLower(term)))
		}
		return items
	}

	export default {
		
		data: () => ({
			search: null,
			searched: [],
            users: [],
            activeInvestments:[],
			totalRows: 0,
			limit: 5
		}),
		created() {
            this.setInvestmentsList(this.limit, 0);
		},
		watch: {
			limit: function(o,n) {
				this.setInvestmentsList(o, 0);
			}
		},
		methods: {
            
             setInvestmentsList(limit, offset){
            InvestmentService.getInvestments(limit, offset).then(response => {
                console.log(response);
                this.activeInvestments = response.data.data;     
				this.searched = this.activeInvestments;
				this.totalRows = response.headers["total-rows"];
            },err => {
                console.log(err);
            });
        },
			newUser() {
				window.alert('Noop')
			},
			searchOnTable() {
				this.searched = searchByName(this.activeInvestments, this.search)
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
