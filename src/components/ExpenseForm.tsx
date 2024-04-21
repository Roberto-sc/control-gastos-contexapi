import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { ChangeEvent, useEffect, useState } from "react";
import type { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const { state,dispatch,remainingBudget } = useBudget();
  const [error, setError] = useState("");
  const [previousAmount,setPreviousAmount] = useState(0)


  useEffect(() => {
      if(state.editingId){
        const editingExpense = state.expenses.filter((currentExpense) => currentExpense.id === state.editingId)[0]

        setExpense(editingExpense)
        setPreviousAmount(editingExpense.amount)
      }
  },[state.editingId])


  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? +value : value,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //validar
    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios");
      return;
    }

    //Valiadar Limite 
    if ((expense.amount - previousAmount) > remainingBudget) {
      setError("Ese gasto se sale del presupuesto ");
      return;
    }

    //Agregar o actualizar el gasto
    if(state.editingId){
      dispatch({type : 'update-expense',payload:{expense : {id:state.editingId, ...expense}}})
    }else{
      dispatch({ type: "add-expense", payload: { expense } });
    }

    // Reiniciar Form
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    })
    setPreviousAmount(0)
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {" "}
       {state.editingId ? 'Editar Gasto' : 'Nuevo Gasto'}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label className="text-xl" htmlFor="expenseName">
          Nombre Gasto
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el Nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          onChange={handleChange}
          value={expense.expenseName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl" htmlFor="amount">
          Cantidad
        </label>
        <input
          type="text"
          id="amount"
          placeholder="Añade la Cantidad del Gasto Ej.300"
          className="bg-slate-100 p-2"
          name="amount"
          onChange={handleChange}
          value={expense.amount}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl" htmlFor="category">
          Categoría
        </label>
        <select
          id="category"
          name="category"
          className="bg-slate-100 p-2"
          onChange={handleChange}
          value={expense.category}
        >
          <option value="">----Seleccione una Categoría----</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xl" htmlFor="amount">
          Fecha Gasto :
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'}

      />
    </form>
  );
}
