'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.min.css';
import 'datatables.net-dt';
import 'datatables.net-buttons/js/dataTables.buttons';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';


export default function ClientList() {
    const tableRef = useRef(null);
    const storageData = localStorage.getItem('user');
    const user = JSON.parse(storageData);


    useEffect(() => {
        let table;

        const fetchClients = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${user.user_id}`);
                const { data } = await res.json();

                const tableElement = $(tableRef.current);

                if ($.fn.dataTable.isDataTable(tableRef.current)) {
                    tableElement.DataTable().destroy();
                    tableElement.empty();
                }

                table = tableElement.DataTable({
                    data: data,
                    dom: '<"flex justify-between items-center mb-4"<"flex"B><"flex"f>>rt<"flex justify-between items-center mt-4"<"flex"i><"flex"p>>',

                    buttons: [
                        {
                            extend: 'csv',
                            text: '<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>CSV</span>',
                            className: 'bg-white hover:bg-blue-100 text-gray-800 font-medium py-2 px-4 border rounded shadow-sm text-sm flex items-center'
                        },
                        {
                            extend: 'print',
                            text: '<span class="flex items-center"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>Print</span>',
                            className: 'bg-white hover:bg-green-100 text-gray-800 font-medium py-2 px-4 border  rounded shadow-sm text-sm flex items-center'
                        }
                    ],
                    language: {
                        search: "",
                        searchPlaceholder: "Search clients...",
                        lengthMenu: "Show _MENU_ entries",
                        info: "Showing _START_ to _END_ of _TOTAL_ entries",
                        paginate: {
                            previous: "← Previous",
                            next: "Next →"
                        }
                    },
                        columns: [
                            { title: 'ID', data: 'id', className: 'font-medium' },
                            { title: 'Full Name', data: 'name', className: 'font-medium text-blue-600' },
                            { title: 'NRC Number', data: 'nrc' },
                            { title: 'Phone', data: 'phone' },
                            {
                                title: 'Occupation',
                                data: 'business', // Try changing this to 'business' if the field is different
                                render: function(data, type, row) {
                                    // Fallback to empty string if null/undefined
                                    return data || '';
                                }
                            },
                            { title: 'Location', data: 'location' },
                            {
                                title: 'Registration Date',
                                data: 'created_at',
                                render: function(data) {
                                    return data ? new Date(data).toLocaleDateString() : '';
                                }
                            },
                            {
                                render: function (data, type, row) {
                                    if (user.user_role === "admin") {
                                        return `
                                        <div style="display: flex; gap: 0.5rem;">
                                            <a href="viewClient/${row.id}" class="bg-blue-600 text-amber-50 hover:bg-blue-600 px-3 py-2 rounded">View</a>
                                            <a href="editClient/${row.id}" class="bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded">Edit</a>
                                        </div>
                                    `;
                                                                } else {
                                                                    return `
                                        <a href="viewClient/${row.id}" class="bg-blue-600 text-amber-50 hover:bg-blue-600 px-3 py-2 rounded">View</a>
                                    `;
                                    }
                                }


                            },
                        ],
                    responsive: true,
                    pageLength: 10,
                    lengthMenu: [5, 10, 25, 50],
                    initComplete: function() {
                        $('.dataTables_filter input').addClass('border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent');
                        $('.dataTables_length select').addClass('border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent');
                    }
                });
            } catch (error) {
                console.error('Error loading client data:', error);
            }
        };

        fetchClients();

        return () => {
            if (table) table.destroy();
        };
    }, []);

    return (
        <table
            ref={tableRef}
            className="w-full text-sm text-left text-gray-700 stripe hover"
            style={{ width: '100%' }}
        ></table>
    );
}