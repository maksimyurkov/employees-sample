'use strict'
import './node_modules/core-js/fn/symbol/iterator.js'
import './node_modules/core-js/modules/es6.symbol.js'
import './node_modules/core-js/modules/es6.string.includes.js'
import './node_modules/whatwg-fetch/fetch.js'

class EmployeesSample extends HTMLElement {
    static get employees() {
        return this.employees
    }

    static set employees(employees) {
        this.employees = employees
    }

    static get searchText() {
        return this.searchText
    }

    static set searchText(searchText) {
        this.searchText = searchText
    }

    static get inputTimer() {
        return this.inputTimer
    }

    static set inputTimer(inputTimer) {
        this.inputTimer = inputTimer
    }

    _getEmployees() {
        let apiUrl = this.getAttribute('api-url')
        return fetch(apiUrl + '?/employees', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        }).then(response => {
            let status = response.status
            if (status === 200) {
                return response.json().then(data => {
                    if (data.code === 401 || data.code === 500) throw Error(data.message)
                    return data
                })
            } else {
                throw Error('Server internal error')
            }
        })
    }

    _filterEmployees() {
        let filteredEmployees = []
        let searchText = this.searchText
        let employees = this.employees
        if (searchText !== '' && searchText !== undefined) {
            for (let e of employees) {
                if (e.displayName.toLowerCase().includes(searchText.toLowerCase())) {
                    filteredEmployees.push(e)
                }
            }
        }
        this._updateList(filteredEmployees)
    }

    _updateList(filteredEmployees) {
        let list = this.shadowRoot.querySelector('#list')
        let scroller = this.shadowRoot.querySelector('#scroller')
        scroller.innerHTML = ''
        if (filteredEmployees.length === 0 && (this.searchText === undefined || this.searchText === '' || this.searchText.length < 4)) {
            this.shadowRoot.querySelector('#filter-employees').style.setProperty('display', 'none', 'important')
            return
        }
        if (filteredEmployees.length === 0 && (this.searchText !== undefined && this.searchText.length > 3)) {
            this.shadowRoot.querySelector('#nothing-found').style.setProperty('display', 'flex', 'important')
        }
        let itemTemplate = document.createElement('template')
        itemTemplate.innerHTML = `
            <a class="item" target="_blank">
                <img src="" class="avatar"/>
                <div class="pad">
                    <div class="primary"></div>
                    <div class="secondary"></div>
                </div>
            </a>
        `
        for (let i of filteredEmployees) {
            let tempTemplate = document.importNode(itemTemplate.content, true)
            tempTemplate.querySelector('.item').setAttribute('href', i.profileURL)
            if (i.photoURL) {
                tempTemplate.querySelector('img').setAttribute('src', i.photoURL)
            } else {
                tempTemplate.querySelector('img').setAttribute('src', this.getAttribute('default-avatar-url'))
            }
            tempTemplate.querySelector('.primary').textContent = i.displayName
            if (i.position) {
                tempTemplate.querySelector('.secondary').textContent = i.position
            } else {
                tempTemplate.querySelector('.secondary').textContent = 'Нет должности'
            }
            scroller.appendChild(tempTemplate)
        }
        this.shadowRoot.querySelector('#filter-employees').style.setProperty('display', 'none', 'important')
            // Fix for IE11...tt
        scroller.click()
        list.style.setProperty('overflow-y', 'scroll', 'important')
        ShadyCSS.styleDocument()
    }

    connectedCallback() {
        let template = document.createElement('template')
        template.innerHTML = `
        <style>
        :host {
            display: block;
            position: relative;
            box-sizing: border-box;            
        }

        :host .cleanslate {
            font-family: "Roboto" !important;
        }

        a, a.item, a.item:visited {
            text-decoration: none !important;
            color: inherit !important;
            outline: none !important;
        }

        #container {
            box-sizing: border-box !important; 
            font-family: 'Roboto' !important;
            width: 100% !important;
            margin: auto !important;
            display: flex !important;
            flex-direction: column !important;
            align-content: center !important;
            padding: 16px !important;
            height: 100% !important;
            max-height: 500px !important;
            box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px !important;
        }

        .loading {
            position: absolute !important;
            top:0 !important;
            left:0 !important;
            right:0 !important;
            bottom:0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            font-size:16px !important;
            background: #fff !important;
        }

        #loading-employees {
            z-index: 9 !important;
        }

        #filter-employees, #nothing-found {
            position: absolute !important;
            top:0 !important;
            left:0 !important;
            right:0 !important;
            bottom:0 !important;
            z-index: 8 !important;
            opacity:0.7 !important;
            display:none !important;
        }

        #title {
            font-size: 24px !important;
        }

        #search {
            font-family: "Roboto" !important;
            margin-top: 16px !important;
            padding: 8px !important;
            font-size: 16px !important;
            border: 1px solid #ddd !important;
        }

        #list-container {
            position: relative !important;
            margin-top: 16px !important;
            box-sizing:border-box !important;
            background: #fafafa !important;
            width: 100% !important;
            height:100% !important;
            min-height: 370px !important;
            max-height: 370px !important;
            overflow:hidden !important;
            border: 1px solid #ddd !important;
        }

        #list {
            display: flex !important;
            flex: 1 !important;
            position: relative !important;
            width: 100% !important;
            height:100% !important;
            min-height: 370px !important;
            max-height: 370px !important;
            padding: 8px !important;
            overflow-y: auto !important;
            box-sizing:border-box !important;
        }

        #scroller {
            width: 100% !important;
            min-height: 100% !important;
            position:relative !important;
            box-sizing:border-box !important;
        }

        .item {
            display:flex !important;
            align-items: center !important;
            width: 100% !important;
            flex-shrink: 0 !important;
            margin-bottom: 8px !important;
            padding: 20px !important;
            border: 1px solid #ddd !important;
            cursor: pointer !important;
            position:relative !important;
            background: #fff !important;
            box-sizing: border-box !important;
        }

        .item:last-child {
            // margin-bottom: 0 !important;
        }

        .avatar {
            height: 40px !important;
            width: 40px !important;
            border-radius: 20px !important;
            box-sizing: border-box !important;
            background-color: #DDD !important;
        }

        .pad {
            display: flex !important;
            justify-content: center !important;
            flex: 1 !important;
            flex-direction: column !important;
            padding: 0 16px !important;
        }
 
        .primary {
            font-size: 16px !important;
            font-weight: 500 !important;
            width: 100% !important;
            line-height: normal !important;
        }
    
        .secondary {
            width:100% !important;
            color: gray !important;
            line-height: normal !important;
        }

        #qq {
            display:none !important;
        }
        </style>
        <div id="container" class="cleanslate">
            <div id="loading-employees" class="loading">Загрузка списка сотрудников...</div>
            <div id="title">Сотрудники</div>
            <input id="search" type="text" placeholder="Введите ФИО (не менее 4 символов)"/>
            <div id="list-container">
                <div id="filter-employees" class="loading">Идет поиск...</div>
                <div id="nothing-found" class="loading">Ничего не найдено</div>
                <div id="list">
                    <div id="scroller"></div>
                </div>
            </div>
        </div>
        `

        ShadyCSS.prepareTemplate(template, 'employees-sample')
        ShadyCSS.styleElement(this)
        this.attachShadow({
            mode: 'open'
        })
        this.shadowRoot.appendChild(document.importNode(template.content, true))

        this.shadowRoot.querySelector('#search').addEventListener('keyup', e => {
            if (this.inputTimer !== undefined) clearTimeout(this.inputTimer)
            this.searchText = this.shadowRoot.querySelector('#search').value
            this.shadowRoot.querySelector('#filter-employees').style.setProperty('display', 'flex', 'important')
            this.shadowRoot.querySelector('#nothing-found').style.setProperty('display', 'none', 'important')
            if (this.searchText !== undefined && this.searchText !== '' && this.searchText.length > 3) {
                this.shadowRoot.querySelector('#filter-employees').style.setProperty('display', 'flex', 'important')
                this.inputTimer = setTimeout(this._filterEmployees.bind(this), 800)
            } else {
                this.shadowRoot.querySelector('#nothing-found').style.setProperty('display', 'none', 'important')
                this._updateList([])
                return
            }
        })

        this._getEmployees().then(employees => {
            this.employees = employees
            this.shadowRoot.querySelector('#loading-employees').style.setProperty('display', 'none', 'important')
        })
    }
}

customElements.define('employees-sample', EmployeesSample)
