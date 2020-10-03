import React, { useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import { Tag, Spin, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import TagExec from "./TagExec";
import type { TagSchema } from "@/models/tag";

interface rootState {
  loading: {
    models: {
      tag: boolean;
    };
  };
  tag: {
    tags: TagSchema[];
  };
}

interface TagMgtProps {
  value?: string[];
  onChange?: Function;
}

const CusTag = styled(Tag)`
    margin-top: 6px;
`;

export default function TagMgt(props?: TagMgtProps) {
  const { list, loading } = useSelector((s: rootState) => ({
    list: s.tag.tags,
    loading: s.loading.models.tag,
  }));
  const tagExec = TagExec();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    return () => {
      tagExec.Destroy();
    };
  });

  const holdHandler = useRef(0);

  function holdStart(callback: Function, critical = 3000) {
    holdHandler.current = setTimeout(callback, critical);
  }

  function holdEnd() {
    clearTimeout(holdHandler.current);
  }

  // 新建标签
  async function create(formValues?: any) {
    try {
      const { color: { hex }, ...restValues } = formValues;
      tagExec?.Update({
        modalProps: {
          confirmLoading: true,
        },
      }).Execute();
      await dispatch({
        type: "tag/add",
        payload: {
          color: hex,
          ...restValues,
        },
      });
      await dispatch({ type: "tag/list" });
      tagExec?.Update({
        modalProps: {
          visible: false,
        },
      }).Execute();
    } catch (e) {
      console.error(e);
    } finally {
      tagExec?.Update({
        modalProps: {
          confirmLoading: false,
        },
      }).Execute();
    }
  }

  // 编辑标签
  async function edit(formValues?: any, id: string) {
    try {
      console.log(formValues);
      const { color: { hex }, ...restValues } = formValues;
      tagExec?.Update({
        modalProps: {
          confirmLoading: true,
        },
      }).Execute();
      await dispatch({
        type: "tag/update",
        payload: {
          id,
          color: hex,
          ...restValues,
        },
      });
      await dispatch({ type: "tag/list" });
      tagExec?.Update({
        modalProps: {
          visible: false,
        },
      }).Execute();
    } catch (e) {
      console.error(e);
    } finally {
      tagExec?.Update({
        modalProps: {
          confirmLoading: false,
        },
      }).Execute();
    }
  }

  // 删除标签
  async function remove(
    id: string,
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) {
    e.preventDefault();
    Modal.confirm({
      title: "操作不可撤销",
      onOk: async () => {
        await dispatch({ type: "tag/delete", payload: id });
        await dispatch({ type: "tag/list" });
      },
    });
  }

  // 打开新建弹窗
  function openCreateExec() {
    tagExec.Update({
      modalProps: {
        visible: true,
        title: "新建标签",
      },
      onOk: create,
      onCancel: closeExec,
    }).Execute();
  }

  // 打开编辑弹窗
  function openEditExec(tag: TagSchema) {
    tagExec.Update({
      modalProps: {
        visible: true,
        title: "编辑标签",
      },
      initVal: tag,
      onOk: (v) => edit(v, tag._id.$oid),
      onCancel: closeExec,
    }).Execute();
  }

  // 关闭弹窗
  function closeExec() {
    tagExec.Update({
      modalProps: {
        visible: false,
      },
    }).Execute();
  }

  return <Spin spinning={loading}>
    <CusTag
      style={{ borderStyle: "dashed", background: "#fff" }}
      onClick={openCreateExec}
    >
      <PlusOutlined /> 新增标签
    </CusTag>
    {list.map((tag: TagSchema) =>
      <CusTag
        closable
        onClose={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
          remove(tag._id.$oid, e)}
        key={tag._id.$oid}
        color={tag.color}
        onTouchStart={() => {
          holdStart(() => openEditExec(tag), 1000);
        }}
        onTouchEnd={holdEnd}
        onMouseDown={() => {
          holdStart(() => openEditExec(tag), 1000);
        }}
        onMouseUp={holdEnd}
      >
        {tag.name}
      </CusTag>
    )}
  </Spin>;
}
